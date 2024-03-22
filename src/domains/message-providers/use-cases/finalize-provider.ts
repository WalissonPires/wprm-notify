import { PrismaClient } from "@prisma/client";
import { UserLogged } from "@/common/auth/user";
import { AppError } from "@/common/error";
import { UseCase } from "@/common/use-cases";
import { ProvidersApi } from "@/common/services/messaging";

export class FinalizeProvider implements UseCase<FinalizeProviderInput, void> {

  private _user: UserLogged;
  private _db: PrismaClient;

  constructor({ userLogged, prismaClient }: { userLogged: UserLogged, prismaClient: PrismaClient }) {

    this._user = userLogged;
    this._db = prismaClient;
  }

  public async execute(input: FinalizeProviderInput): Promise<void> {

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
      accessToken: account.messagingApiToken
    });

    await api.finalize({
      id: input.providerId
    });
  }
}

export interface FinalizeProviderInput {
  providerId: number;
}