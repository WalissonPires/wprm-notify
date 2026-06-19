import { Prisma, PrismaClient } from "@prisma/client";
import { UseCase } from "@/common/use-cases";
import { UserLogged } from "@/common/auth/user";
import { AppError } from "@/common/error";
import { MessagingApi } from "@/common/services/messaging";
import { SendMessageInput } from "./send-message-types";
import { SendMessageAsyncResult, SendMessageJobMetadata } from "./send-message-async-types";
import { jobStore } from "@/domains/jobs/job-store";
import { PQueueAdapter } from "@/common/queue/p-queue-adapter";
import { LoggerFactory } from "@/common/logger";

export class SendMessageAsync implements UseCase<SendMessageInput, SendMessageAsyncResult> {
  private _user: UserLogged;
  private _db: PrismaClient;
  private _logger = new LoggerFactory().createLogger({ scope: SendMessageAsync.name });

  constructor({ userLogged, prismaClient }: { userLogged: UserLogged, prismaClient: PrismaClient }) {
    this._user = userLogged;
    this._db = prismaClient;
  }

  public async execute(input: SendMessageInput): Promise<SendMessageAsyncResult> {
    const contactsFilter: Prisma.ContactWhereInput[] = [];

    if (input.groupsId && input.groupsId.length > 0) {
      contactsFilter.push({
        groups: {
          some: {
            groupId: {
              in: input.groupsId
            }
          }
        }
      });
    }

    if (input.contactsId && input.contactsId.length > 0) {
      contactsFilter.push({
        id: {
          in: input.contactsId
        }
      });
    }

    if (contactsFilter.length === 0) {
      throw new AppError('Informe os grupos ou contatos para enviar a mensagem');
    }

    const contacts = await this._db.contact.findMany({
      where: {
        AND: {
          accountId: this._user.accountId,
          OR: contactsFilter
        }
      }
    });

    if (contacts.length === 0) {
      throw new AppError('Nenhum contato encontrado para o envio');
    }

    const account = await this._db.account.findFirst({
      where: {
        id: this._user.accountId
      },
      select: {
        messagingApiToken: true
      }
    });

    if (!account?.messagingApiToken) {
      throw new AppError('Messaging not configured');
    }

    const metadata: SendMessageJobMetadata = {
      groupsId: input.groupsId,
      contactsId: input.contactsId,
      message: {
        content: input.message.content,
        medias: input.message.medias?.map(m => ({
          mimeType: m.mimeType,
          label: m.label
        }))
      }
    };

    // Create the job in pending state
    const job = jobStore.create('send-message', this._user.accountId, contacts.length, metadata);
    const jobId = job.id;

    // Start background queue processing asynchronously (non-blocking)
    setImmediate(() => {
      this.processJob(jobId, contacts, account.messagingApiToken!, input).catch(err => {
        this._logger.error(`Error processing job ${jobId}: ${AppError.parse(err).toLog()}`);
      });
    });

    return { jobId };
  }

  private async processJob(
    jobId: string,
    contacts: Array<{ id: string; phone: string | null; name: string }>,
    messagingApiToken: string,
    input: SendMessageInput
  ): Promise<void> {
    jobStore.start(jobId);

    const messagingApi = new MessagingApi({
      accessToken: messagingApiToken
    });

    const queue = new PQueueAdapter({ concurrency: 5 });

    for (const contact of contacts) {
      queue.add(async () => {
        try {
          if (!contact.phone) {
            throw new AppError("Telefone não cadastrado");
          }

          const sendResult = await messagingApi.sendMessage({
            to: '55' + contact.phone,
            content: input.message.content,
            medias: input.message.medias
          }) ?? [];

          const success = sendResult.every(x => x.success);
          if (!success) {
            const errorMessage = sendResult.map(x => `Provider ${x.providerId}: ${x.success ? 'OK' : x.errorMessage}`).filter(x => x).join('; ');
            throw new AppError(errorMessage);
          }

          jobStore.incrementSuccess(jobId);
        } catch (error) {
          this._logger.warn(`Failed to send message to ${contact.phone || 'unknown'} in job ${jobId}: ${AppError.parse(error).message}`);
          jobStore.incrementFailure(jobId);
        }
      });
    }

    await queue.onIdle();
    jobStore.finish(jobId);
  }
}
