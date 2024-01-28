import { PrismaClient } from "@prisma/client";
import { AppError } from "@/common/error";
import { UseCase } from "@/common/use-cases";
import { UserLogged } from "@/common/auth/user";
import { Provider, ProviderType } from "@/common/services/messaging/models";
import { ProvidersApi } from "@/common/services/messaging";

export class CreateWhatsappProvider implements UseCase<void, Provider> {

  private _user: UserLogged;
  private _db: PrismaClient;

  constructor({ userLogged, prismaClient }: { userLogged: UserLogged, prismaClient: PrismaClient }) {

    this._user = userLogged;
    this._db = prismaClient;
  }

  public async execute(input: void): Promise<Provider> {

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

    const provider = await api.create({
      provider: {
        name: 'Wprm-Notify Whatsapp',
        type: ProviderType.Whatsapp,
        config: {}
      }
    });

    if (provider == null)
      throw new AppError('Fail create provider');

    return provider;
  }
}