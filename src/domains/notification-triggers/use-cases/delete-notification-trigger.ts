import { PrismaClient } from "@prisma/client";
import { UseCase } from "@/common/use-cases";
import { UserLogged } from "@/common/auth/user";


export class DeleteNotificationTrigger implements UseCase<DeleteNotificationTriggerInput, void> {

  private _user: UserLogged;
  private _db: PrismaClient;

  constructor({ userLogged, prismaClient }: { userLogged: UserLogged, prismaClient: PrismaClient }) {

    this._user = userLogged;
    this._db = prismaClient;
  }

  public async execute(input: DeleteNotificationTriggerInput): Promise<void> {

    await this._db.$transaction(async transaction => {

      await transaction.notification.deleteMany({
        where: {
          accountId: this._user.accountId,
          triggerId: input.id,
          sendedAt: null,
        }
      });

      await transaction.notificationTrigger.deleteMany({
        where: {
          id: input.id,
          contact: {
            accountId: this._user.accountId
          }
        }
      });

    });
  }

}

export interface DeleteNotificationTriggerInput {
  id: string;
}