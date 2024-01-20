import { UseCase } from "@/common/use-cases";
import { UserLogged } from "@/common/auth/user";
import { UserSessionManager } from "@/domains/auth/services/user-session-maganer";
import { PrismaClient } from "@prisma/client";
import { PasswordEncrypt } from "../services/password-encrypt";

export class Login implements UseCase<LoginInput, UserLogged | null> {

  private _db: PrismaClient;

  constructor({ prismaClient }: { prismaClient: PrismaClient }) {

    this._db = prismaClient;
  }

  public async execute(input: LoginInput): Promise<UserLogged | null> {

    const email = input.email.toLowerCase();
    const password = await new PasswordEncrypt().encrypt(input.password);

    const accountDb = await this._db.account.findFirst({
      where: {
        email: email,
        password: password
      }
    });

    if (!accountDb)
      return null;

    const user: UserLogged = {
      accountId: accountDb.id,
      isLogged: true
    };

    await new UserSessionManager().setUser(user);

    await this._db.account.update({
      where: {
        id: accountDb.id,
      },
      data: {
        lastAccess: new Date()
      }
    });

    return user;
  }

}

export interface LoginInput {
  email: string;
  password: string;
}