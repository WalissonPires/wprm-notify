import { PrismaClient } from "@prisma/client";
import { UseCase } from "@/common/use-cases";
import { UserLogged } from "@/common/auth/user";


export class DeleteGroup implements UseCase<DeleteGroupInput, void> {

  private _user: UserLogged;
  private _db: PrismaClient;

  constructor({ userLogged, prismaClient }: { userLogged: UserLogged, prismaClient: PrismaClient }) {

    this._user = userLogged;
    this._db = prismaClient;
  }

  public async execute(input: DeleteGroupInput): Promise<void> {

    await this._db.group.deleteMany({
      where: {
        id: input.groupId,
        accountId: this._user.accountId
      }
    });
  }
}

export interface DeleteGroupInput {
  groupId: string;
}