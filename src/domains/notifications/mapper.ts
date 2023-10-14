import { Notification as NotificationDb } from "@prisma/client";
import { Notification1 } from "./use-cases/entities";


export class NotificationMapper {

  public mapToView1(notificationDb: NotificationDb): Notification1 {

    const notification: Notification1 = {
      id: notificationDb.id,
      sendedAt: notificationDb.sendedAt?.toISOString() ?? null,
      scheduledAt: notificationDb.scheduledAt.toISOString(),
      content: notificationDb.content
    };

    return notification;
  }
}