import { PrismaClient } from "@prisma/client";
import { UseCase } from "@/common/use-cases";
import { UserLogged } from "@/common/auth/user";
import { MessageTemplate1 } from "../entities";
import { MessageTemplateMapper } from "../mapper";


export class GetMessageTemplateById implements UseCase<GetMessageTemplateByIdInput, MessageTemplate1 | null> {

  private _db: PrismaClient;
  private _user: UserLogged;

  constructor({ prismaClient, userLogged }: { prismaClient: PrismaClient, userLogged: UserLogged }) {

    this._db = prismaClient;
    this._user = userLogged;
  }

  public async execute(input: GetMessageTemplateByIdInput): Promise<MessageTemplate1 | null> {

    const messageTemplate = await this._db.templateMessage.findFirst({
      where: {
        id: input.messageTemplateId,
        accountId: this._user.accountId
      },
      include: {
        params: true
      }
    });

    if (!messageTemplate)
      return null;

    const mapper = new MessageTemplateMapper();
    return mapper.mapToView1(messageTemplate);
  }

}

export interface GetMessageTemplateByIdInput {
  messageTemplateId: string;
}