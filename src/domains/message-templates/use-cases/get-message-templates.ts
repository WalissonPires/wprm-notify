import { PrismaClient } from "@prisma/client";
import { PagedInput, PagedResult } from "@/common/http/pagination";
import { UseCase } from "@/common/use-cases";
import { MessageTemplate1 } from "../entities";
import { MessageTemplateMapper } from "../mapper";


export class GetMessageTemplates implements UseCase<GetMessageTemplatesInput, PagedResult<MessageTemplate1>> {

  public async execute(input: GetMessageTemplatesInput): Promise<PagedResult<MessageTemplate1>> {

    const db = new PrismaClient();

    const count = await db.templateMessage.count();

    const messageTemplates = await db.templateMessage.findMany({
      skip: input.offset,
      take: input.limit,
      orderBy: {
        name: 'asc'
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