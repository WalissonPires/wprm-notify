import { Prisma, PrismaClient } from "@prisma/client";
import { UseCase } from "@/common/use-cases";
import { UserLogged } from "@/common/auth/user";
import { PagedInput, PagedResult } from "@/common/http/pagination";
import { NotificationMapper } from "../mapper";
import { Notification1 } from "./entities";
import { DateTime } from "luxon";


export class GetNotifications implements UseCase<GetNotificationsInput, PagedResult<Notification1>> {

  private _db: PrismaClient;
  private _user: UserLogged;

  constructor({ prismaClient, userLogged }: { prismaClient: PrismaClient, userLogged: UserLogged }) {

    this._db = prismaClient;
    this._user = userLogged;
  }

  public async execute(input: GetNotificationsInput): Promise<PagedResult<Notification1>> {

    const lastHour = DateTime.now().minus({ hour: 1 });

    const filter: Prisma.NotificationWhereInput = {
      accountId: this._user.accountId,
      OR: [{
        canceledAt: null
      }, {
        canceledAt: {
          gte: lastHour.toJSDate()
        }
      }]
    };

    if (input.isSended === true) {

      filter.sendedAt = { not: null };
    }
    else if (input.isSended === false) {

      filter.sendedAt = { equals: null };
    }

    if (input.contactId) {

      filter.trigger = { contactId: { equals: input.contactId } };
    }

    const count = await this._db.notification.count({
      where: filter
    });

    const notifications = await this._db.notification.findMany({
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
      orderBy: [{
        sendedAt: 'desc',
      }, {
        scheduledAt: 'asc'
      }]
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
