import { PrismaClient } from "@prisma/client";
import { UseCase } from "@/common/use-cases";
import { UserLogged } from "@/common/auth/user";

export class DeleteContact implements UseCase<DeleteContactInput, void> {

  private _user: UserLogged;
  private _db: PrismaClient;

  constructor({ userLogged, prismaClient }: { userLogged: UserLogged, prismaClient: PrismaClient }) {

    this._user = userLogged;
    this._db = prismaClient;
  }

  public async execute(input: DeleteContactInput): Promise<void> {

    await this._db.contact.deleteMany({
      where: {
        id: input.contactId,
        accountId: this._user.accountId
      }
    });
  }
}

export interface DeleteContactInput {
  contactId: string;
}