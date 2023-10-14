import { PrismaClient } from "@prisma/client";
import { PagedInput, PagedResult } from "@/common/http/pagination";
import { UseCase } from "@/common/use-cases";
import { Trigger1 } from "../entities";
import { TriggerMapper } from "../mapper";


export class GetNotificationTriggers implements UseCase<GetNotificationTriggersInput, PagedResult<Trigger1>> {

  public async execute(input: GetNotificationTriggersInput): Promise<PagedResult<Trigger1>> {

    const db = new PrismaClient();

    const count = await db.notificationTrigger.count({
      where: {
        contactId: input.contactId
      }
    });

    const triggers = await db.notificationTrigger.findMany({
      where: {
        contactId: input.contactId
      },
      skip: input.offset,
      take: input.limit,
      include: {
        templateMessage: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        templateMessage: {
          name: 'asc'
        }
      }
    });

    const mapper = new TriggerMapper();
    const data: Trigger1[] = triggers.map(x => mapper.mapToView1(x));

    const result: PagedResult<Trigger1> = {
      offset: input.offset,
      limit: input.limit,
      count,
      data
    };

    return result;
  }

}

export interface GetNotificationTriggersInput extends PagedInput {
  contactId?: string;
}
