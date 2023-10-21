import { PrismaClient } from "@prisma/client";
import { UseCase } from "@/common/use-cases";
import { MessagingApi } from "@/common/services/messaging";

export class SendPendingNotifications implements UseCase<void, void> {

  public async execute(_: void): Promise<void> {

    const db = new PrismaClient();
    const currentDate = new Date();

    const notifications = await db.notification.findMany({
      where: {
        sendedAt: null,
        scheduledAt: {
          lte: currentDate
        }
      },
      include: {
        contact: {
          select: {
            phone: true,
            email: true,
          }
        }
      }
    });

    if (notifications.length === 0) return;

    const messagingApi = new MessagingApi();

    for(const notify of notifications) {

      try {

        if (!notify.contact) continue;

        const { phone, email } = notify.contact;

        if (!phone) continue;

        await messagingApi.sendMessage({
          to: '55' + phone,
          content: notify.content
        });

        await db.notification.update({
          where: {
            id: notify.id
          },
          data: {
            sendedAt: new Date()
          }
        });

      }
      catch(error) {
        console.error(error);
      }
    }
  }

}