import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { UseCase } from "@/common/use-cases";
import { ProvidersApi } from "@/common/services/messaging";
import { ChatNode } from "@/common/services/messaging/models";
import { UserLogged } from "@/common/auth/user";
import { AppError } from "@/common/error";


export class UpdateProviderChatbotFlow implements UseCase<UpdateProviderChatbotFlowInput, void> {

  private _user: UserLogged;
  private _db: PrismaClient;

  constructor({ userLogged, prismaClient }: { userLogged: UserLogged, prismaClient: PrismaClient }) {

    this._user = userLogged;
    this._db = prismaClient;
  }

  public async execute(input: UpdateProviderChatbotFlowInput): Promise<void> {

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

    await api.updateChatbotFlow({
      id: input.providerId,
      chatbotFlow: input.chatbotFlow
    });
  }
}

export interface UpdateProviderChatbotFlowInput {
  providerId: number;
  chatbotFlow: ChatNode;
}

export const updateProviderChatbotFlowInputSchema = z.object({
  chatbotFlow: z.any()
});