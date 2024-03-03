import { PrismaClient } from "@prisma/client";
import { UseCase } from "@/common/use-cases";
import { UserLogged } from "@/common/auth/user";

export class CancelNotification implements UseCase<CancelNotificationInput, void> {

  private _db: PrismaClient;
  private _user: UserLogged;

  constructor({ prismaClient, userLogged }: { prismaClient: PrismaClient, userLogged: UserLogged }) {

    this._db = prismaClient;
    this._user = userLogged;
  }

  public async execute(input: CancelNotificationInput): Promise<void> {

    await this._db.notification.update({
      where: {
        id: input.notificationId,
        accountId: this._user.accountId,
        sendedAt: null
      },
      data: {
        canceledAt: new Date()
      }
    });
  }
}

export interface CancelNotificationInput {
  notificationId: string;
}