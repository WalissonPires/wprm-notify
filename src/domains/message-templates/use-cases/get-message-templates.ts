import { PrismaClient } from "@prisma/client";
import { UseCase } from "@/common/use-cases";
import { UserLogged } from "@/common/auth/user";
import { PagedInput, PagedResult } from "@/common/http/pagination";
import { MessageTemplate1 } from "../entities";
import { MessageTemplateMapper } from "../mapper";


export class GetMessageTemplates implements UseCase<GetMessageTemplatesInput, PagedResult<MessageTemplate1>> {

  private _db: PrismaClient;
  private _user: UserLogged;

  constructor({ prismaClient, userLogged }: { prismaClient: PrismaClient, userLogged: UserLogged }) {

    this._db = prismaClient;
    this._user = userLogged;
  }

  public async execute(input: GetMessageTemplatesInput): Promise<PagedResult<MessageTemplate1>> {

    const count = await this._db.templateMessage.count({
      where: {
        accountId: this._user.accountId
      }
    });

    const messageTemplates = await this._db.templateMessage.findMany({
      where: {
        accountId: this._user.accountId
      },
      skip: input.offset,
      take: input.limit,
      orderBy: {
        name: 'asc'
      },
      include: {
        params: {
          select: {
            type: true,
            name: true
          }
        }
      }
    });

    const mapper = new MessageTemplateMapper();
    const data = messageTemplates.map(msgTemplate => mapper.mapToView1(msgTemplate));

    const result: PagedResult<MessageTemplate1> = {
      offset: input.offset,
      limit: input.limit,
      count,
      data
    };

    return result;
  }

}

export interface GetMessageTemplatesInput extends PagedInput {

}