import { z } from "zod";
import { PrismaClient } from "@prisma/client";
import { UseCase } from "@/common/use-cases";
import { ProvidersApi } from "@/common/services/messaging";
import { UserLogged } from "@/common/auth/user";
import { AppError } from "@/common/error";


export class UpdateProviderChatbotStatus implements UseCase<UpdateProviderChatbotStatusInput, void> {

  private _user: UserLogged;
  private _db: PrismaClient;

  constructor({ userLogged, prismaClient }: { userLogged: UserLogged, prismaClient: PrismaClient }) {

    this._user = userLogged;
    this._db = prismaClient;
  }

  public async execute(input: UpdateProviderChatbotStatusInput): Promise<void> {

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

    await api.updateChatbotStatus({
      id: input.providerId,
      active: input.active
    });
  }
}

export interface UpdateProviderChatbotStatusInput {
  providerId: number;
  active: boolean;
}

export const updateProviderChatbotStatusInputSchema = z.object({
  active: z.boolean()
});