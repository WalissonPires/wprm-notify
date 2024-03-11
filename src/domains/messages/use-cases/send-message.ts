import { Prisma, PrismaClient } from "@prisma/client";
import { UseCase } from "@/common/use-cases";
import { UserLogged } from "@/common/auth/user";
import { AppError } from "@/common/error";
import { MessagingApi } from "@/common/services/messaging";
import { SendMessageInput, SendMessageResult } from "./send-message-types";


export class SendMessage implements UseCase<SendMessageInput, SendMessageResult> {

  private _user: UserLogged;
  private _db: PrismaClient;

  constructor({ userLogged, prismaClient }: { userLogged: UserLogged, prismaClient: PrismaClient }) {

    this._user = userLogged;
    this._db = prismaClient;
  }

  public async execute(input: SendMessageInput): Promise<SendMessageResult> {

    const contactsFilter: Prisma.ContactWhereInput[] = [];

    if (input.groupsId?.length! > 0) {

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

    if (input.contactsId?.length! > 0) {

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

    const messagingApi = new MessagingApi({
      accessToken: account.messagingApiToken
    });

    const result: SendMessageResult = {
      contacts: []
    };

    for(const contact of contacts) {

      try {
        const sendResult = await messagingApi.sendMessage({
          to: '55' + contact.phone,
          content: input.message.content,
          medias: input.message.medias
        });

        let { success, errorMessage } = sendResult[0] ?? {};

        if (!success && !errorMessage)
          errorMessage = 'Falha ao enviar mensagem';

        if (errorMessage)
          throw new AppError(errorMessage);

        result.contacts.push({
          id: contact.id,
          name: contact.name,
          isSended: true,
          errorMessage: null
        });
      }
      catch(error) {
        result.contacts.push({
          id: contact.id,
          name: contact.name,
          isSended: false,
          errorMessage: AppError.parse(error).message
        });
      }
    }

    return result;
  }
}