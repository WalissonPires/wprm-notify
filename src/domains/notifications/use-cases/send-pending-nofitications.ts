import { Notification as NotificationDb, Contact as ContactDb, Account as AccountDb, TemplateMessageParam as TemplateMessageParamDb, TemplateMessageParamType } from "@prisma/client";
import { UseCase } from "@/common/use-cases";
import { Media, MessagingApi } from "@/common/services/messaging";
import { LoggerFactory } from "@/common/logger";
import { AppError } from "@/common/error";
import { PrismaClientFactory } from "@/common/database/prisma-factory";
import { parseDataUrl } from "@/common/primitives/file/data-url";

export class SendPendingNotifications implements UseCase<void, void> {

  public async execute(_: void): Promise<void> {

    const db = PrismaClientFactory.create();
    const logger = new LoggerFactory().createLogger({ scope: SendPendingNotifications.name });
    const currentDate = new Date();

    logger.debug('Start task send notifications');

    const notifications = await db.notification.findMany({
      where: {
        sendedAt: null,
        canceledAt: null,
        errorAt: null,
        scheduledAt: {
          lte: currentDate
        }
      },
      include: {
        account: {
          select: {
            messagingApiToken: true
          }
        },
        contact: {
          select: {
            phone: true,
            email: true,
          }
        },
        trigger: {
          include: {
            templateMessage: {
              include: {
                params: true
              }
            }
          }
        }
      }
    });

    if (notifications.length === 0) {
      logger.debug('Zero notifications to send');
      return;
    }

    logger.debug(`${notifications.length} notifications to send`);

    const notificationsByAccount: Record<string, NotificationAccountGroup> = notifications.reduce((accounts, notify) => {

      if (!accounts[notify.accountId]) {

        accounts[notify.accountId] = {
          accountId: notify.accountId,
          accessToken: notify.account.messagingApiToken,
          notifications: []
        };
      }

      accounts[notify.accountId].notifications.push(notify);

      return accounts;

    }, {} as Record<string, NotificationAccountGroup>);

    for(const accountId in notificationsByAccount) {

      const accountGroup = notificationsByAccount[accountId];

      if (!accountGroup.accessToken) {

        logger.warn('Messaging not configured in account: ' + accountId);
        continue;
      }

      const messagingApi = new MessagingApi({
        accessToken: accountGroup.accessToken
      });

      for(const notify of accountGroup.notifications) {

        try {

          if (!notify.contact) {
            logger.debug(`Notification ${notify.id} without contact. Skipped.`);
            continue;
          }

          const { phone, email } = notify.contact;

          if (!phone) {
            logger.debug(`Notification ${notify.id} without phone. Skipped.`);
            continue;
          }

          const medias = (notify.trigger?.templateMessage?.params.filter(x => x.type === TemplateMessageParamType.File && x.value) ?? []).map(p => {

            const dataUrl = parseDataUrl(p.value!);
            if (!dataUrl)
              return null!;

            const media: Media = {
              mimeType: dataUrl.mimeType,
              fileBase64: dataUrl.base64
            };

            return media;

          }).filter(p => p !== null);

          logger.debug(`Sending notification ${notify.id}`);

          const sendResult = await messagingApi.sendMessage({
            to: '55' + phone,
            content: notify.content,
            medias: medias
          });

          if (sendResult?.at(0)?.success) {
            logger.debug(`Notification ${notify.id} sended`);

            await db.notification.update({
              where: {
                id: notify.id
              },
              data: {
                sendedAt: new Date(),
                errorAt: null,
                errorMessage: null
              }
            });
          }
          else {
            const errorMessage = sendResult?.at(0)?.errorMessage || 'Unknown error';
            throw new AppError(`Error sending notification ${notify.id}: ${errorMessage}`);
          }
        }
        catch(error) {
          logger.error(AppError.parse(error).message);

          await db.notification.update({
            where: {
              id: notify.id
            },
            data: {
              errorAt: new Date(),
              errorMessage: AppError.parse(error).message.substring(0, 500)
            }
          });
        }
      }
    }

    logger.debug('End task send notifications');
  }

}

interface NotificationAccountGroup {
  accountId: string;
  accessToken: string | null;
  notifications: (NotificationDb & {
    account: Pick<AccountDb, 'messagingApiToken'>;
    contact: Pick<ContactDb, 'email' | 'phone'> | null;
    trigger: {
      templateMessage: {
        params: TemplateMessageParamDb[];
      } | null;
    } | null;
  })[];
}