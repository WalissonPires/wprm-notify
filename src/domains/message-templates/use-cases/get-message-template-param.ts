import { PrismaClient } from "@prisma/client";
import { UseCase } from "@/common/use-cases";
import { UserLogged } from "@/common/auth/user";
import { MessageTemplateParam, MessageTemplateParamType } from "../entities";

export class GetMessageTemplateParam implements UseCase<GetMessageTemplateParamInput, MessageTemplateParam | null> {

  private _db: PrismaClient;
  private _user: UserLogged;

  constructor({ prismaClient, userLogged }: { prismaClient: PrismaClient, userLogged: UserLogged }) {

    this._db = prismaClient;
    this._user = userLogged;
  }

  public async execute(input: GetMessageTemplateParamInput): Promise<MessageTemplateParam | null> {

    const messageTemplateParam = await this._db.templateMessageParam.findFirst({
      where: {
        templateMessageId: input.messageTemplateId,
        name: input.paramName,
        templateMessage: {
          accountId: this._user.accountId
        }
      }
    });

    if (!messageTemplateParam)
      return null;

    const param: MessageTemplateParam = {
      name: messageTemplateParam.name,
      type: messageTemplateParam.type as MessageTemplateParamType,
      value: messageTemplateParam.value
    };

    return param;
  }

}

export interface GetMessageTemplateParamInput {
  messageTemplateId: string;
  paramName: string;
}