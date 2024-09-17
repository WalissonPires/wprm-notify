import { PrismaClient } from "@prisma/client";
import { UseCase } from "@/common/use-cases";
import { UserLogged } from "@/common/auth/user";
import { Trigger1 } from "../entities";
import { TriggerMapper } from "../mapper";


export class GetNotificationTrigger implements UseCase<GetNotificationTriggerInput, Trigger1 | null> {

  private _user: UserLogged;
  private _db: PrismaClient;

  constructor({ userLogged, prismaClient }: { userLogged: UserLogged, prismaClient: PrismaClient }) {

    this._user = userLogged;
    this._db = prismaClient;
  }

  public async execute(input: GetNotificationTriggerInput): Promise<Trigger1 | null> {

    const trigger = await this._db.notificationTrigger.findFirst({
      where: {
        id: input.triggerId,
        contact: {
          accountId: this._user.accountId
        }
      },
      include: {
        templateMessage: {
          select: {
            id: true,
            name: true,
            notifyDaysBefore: true
          }
        }
      }
    });

    const mapper = new TriggerMapper();
    const result = trigger ? mapper.mapToView1(trigger) : null;
    return result;
  }

}

export interface GetNotificationTriggerInput {
  triggerId: string;
}
