import { Prisma } from "@prisma/client";
import { UseCase } from "@/common/use-cases";
import { PagedInput, PagedResult } from "@/common/http/pagination";
import { PrismaClientFactory } from "@/common/database/prisma-factory";
import { NotificationMapper } from "../mapper";
import { Notification1 } from "./entities";


export class GetNotifications implements UseCase<GetNotificationsInput, PagedResult<Notification1>> {

  public async execute(input: GetNotificationsInput): Promise<PagedResult<Notification1>> {

    const db = PrismaClientFactory.create();

    const filter: Prisma.NotificationWhereInput = {};

    if (input.isSended === true) {

      filter.sendedAt = { not: null };
    }
    else if (input.isSended === false) {

      filter.sendedAt = { equals: null };
    }

    if (input.contactId) {

      filter.trigger = { contactId: { equals: input.contactId } };
    }

    const count = await db.notification.count({
      where: filter
    });

    const notifications = await db.notification.findMany({
      where: filter,
      skip: input.offset,
      take: input.limit,
      include: {
        trigger: {
          include: {
            contact: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      },
      orderBy: {
        scheduledAt: 'desc'
      }
    });

    const mapper = new NotificationMapper();
    const data: Notification1[] = notifications.map(x => mapper.mapToView1(x));

    const result: PagedResult<Notification1> = {
      offset: input.offset,
      limit: input.limit,
      count,
      data
    };

    return result;
  }
}

export interface GetNotificationsInput extends PagedInput {
  contactId?: string;
  isSended?: boolean;
}
