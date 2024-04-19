import { UseCase } from "@/common/use-cases";
import { UserSessionManager } from "@/domains/auth/services/user-session-maganer";
import { PrismaClient } from "@prisma/client";
import { GetCurrentUserResult } from "./get-current-user-types";


export class GetCurrentUser implements UseCase<void, GetCurrentUserResult | null> {

  private _db: PrismaClient;

  constructor({ prismaClient }: { prismaClient: PrismaClient }) {

    this._db = prismaClient;
  }

  public async execute(_: void): Promise<GetCurrentUserResult | null> {

    const user = await new UserSessionManager().getUser();

    if (!user) return null;

    const accountDb = await this._db.account.findFirst({
      where: {
        id: user.accountId
      }
    });

    if (!accountDb)
      return null;

    const result: GetCurrentUserResult = {
      accountId: accountDb.id,
      name: accountDb.name
    };

    return result;
  }
}