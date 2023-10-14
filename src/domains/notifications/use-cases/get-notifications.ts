import { Prisma, PrismaClient } from "@prisma/client";
import { PagedInput, PagedResult } from "@/common/http/pagination";
import { UseCase } from "@/common/use-cases";
import { NotificationMapper } from "../mapper";
import { Notification1 } from "./entities";


export class GetNotifications implements UseCase<GetNotificationsInput, PagedResult<Notification1>> {

  public async execute(input: GetNotificationsInput): Promise<PagedResult<Notification1>> {

    const db = new PrismaClient();

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
