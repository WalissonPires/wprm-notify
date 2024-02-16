import { PrismaClient } from "@prisma/client";
import { UseCase } from "@/common/use-cases";
import { UserLogged } from "@/common/auth/user";


export class DeleteMessageTemplate implements UseCase<DeleteMessageTemplateInput, void> {

  private _user: UserLogged;
  private _db: PrismaClient;

  constructor({ userLogged, prismaClient }: { userLogged: UserLogged, prismaClient: PrismaClient }) {

    this._user = userLogged;
    this._db = prismaClient;
  }

  public async execute(input: DeleteMessageTemplateInput): Promise<void> {

    await this._db.templateMessage.deleteMany({
      where: {
        id: input.messageTemplateId,
        accountId: this._user.accountId
      }
    });
  }
}

export interface DeleteMessageTemplateInput {
  messageTemplateId: string;
}