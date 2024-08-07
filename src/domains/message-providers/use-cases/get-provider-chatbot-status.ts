import { PrismaClient } from "@prisma/client";
import { UseCase } from "@/common/use-cases";
import { ProvidersApi } from "@/common/services/messaging";
import { ChatbotStatus } from "@/common/services/messaging/models";
import { UserLogged } from "@/common/auth/user";
import { AppError } from "@/common/error";


export class GetProviderChatbotStatus implements UseCase<GetProviderChatbotStatusInput, ChatbotStatus | null> {

  private _user: UserLogged;
  private _db: PrismaClient;

  constructor({ userLogged, prismaClient }: { userLogged: UserLogged, prismaClient: PrismaClient }) {

    this._user = userLogged;
    this._db = prismaClient;
  }

  public async execute(input: GetProviderChatbotStatusInput): Promise<ChatbotStatus | null> {

    const account = await this._db.account.findFirstOrThrow({
      where: {
        id: this._user.accountId
      },
      select: {
        messagingApiToken: true
      }
    });

    if (!account?.messagingApiToken)
      throw new AppError('Messaging not configured');

    const api = new ProvidersApi({
      accessToken: account?.messagingApiToken
    });

    const result = await api.getChatbotStatus({
      id: input.providerId
    });

    return result;
  }
}

export interface GetProviderChatbotStatusInput {
  providerId: number;
}