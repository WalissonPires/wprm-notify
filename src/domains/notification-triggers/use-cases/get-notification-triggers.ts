import { PrismaClient } from "@prisma/client";
import { UseCase } from "@/common/use-cases";
import { UserLogged } from "@/common/auth/user";
import { PagedInput, PagedResult } from "@/common/http/pagination";
import { Trigger1 } from "../entities";
import { TriggerMapper } from "../mapper";


export class GetNotificationTriggers implements UseCase<GetNotificationTriggersInput, PagedResult<Trigger1>> {

  private _user: UserLogged;
  private _db: PrismaClient;

  constructor({ userLogged, prismaClient }: { userLogged: UserLogged, prismaClient: PrismaClient }) {

    this._user = userLogged;
    this._db = prismaClient;
  }

  public async execute(input: GetNotificationTriggersInput): Promise<PagedResult<Trigger1>> {

    const count = await this._db.notificationTrigger.count({
      where: {
        contactId: input.contactId,
        contact: {
          accountId: this._user.accountId
        }
      }
    });

    const triggers = await this._db.notificationTrigger.findMany({
      where: {
        contactId: input.contactId,
        contact: {
          accountId: this._user.accountId
        }
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
