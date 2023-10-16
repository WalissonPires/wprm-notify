import { Contact as ContactDb, Notification as NotificationDb, NotificationTrigger as NotificationTriggerDb } from "@prisma/client";
import { Notification1 } from "./use-cases/entities";


export class NotificationMapper {

  public mapToView1(notificationDb: NotificationDb1): Notification1 {

    const notification: Notification1 = {
      id: notificationDb.id,
      sendedAt: notificationDb.sendedAt?.toISOString() ?? null,
      scheduledAt: notificationDb.scheduledAt.toISOString(),
      content: notificationDb.content,
      contact: notificationDb.trigger?.contact ? {
        id: notificationDb.trigger.contact.id,
        name: notificationDb.trigger.contact.name,
      } : null
    };

    return notification;
  }
}

type NotificationDb1 = NotificationDb & {
  trigger: NotificationTriggerDb & {
    contact: Pick<ContactDb, 'id' | 'name'>;
  } | null;
}