import { PrismaClient } from "@prisma/client";
import { IdGenerator } from "@/common/identity/generate";
import { UseCase } from "@/common/use-cases";
import { AppError } from "@/common/error";
import { TriggerMapper } from "../mapper";
import { MessageTemplateMapper } from "../../message-templates/mapper";


export class GenerateNotificationsByTriggers implements UseCase<void, void> {

  public async execute(input: void): Promise<void> {

    const db = new PrismaClient();

    const limit = 100;
    let offset = 0;

    const triggerMapper = new TriggerMapper();
    const messageTemplateMapper = new MessageTemplateMapper();
    const idGen = new IdGenerator();

    while (true) {

      const triggers = await db.notificationTrigger.findMany({
        skip: offset,
        take: limit,
        include: {
          contact: {
            select: {
              accountId: true
            }
          },
          templateMessage: true
        }
      });

      offset += limit;

      for(const triggerDb of triggers) {

        const trigger = triggerMapper.map(triggerDb);

        const nextTriggerDate = trigger.nextTriggerDate();

        const notificationExists = await db.notification.findFirst({
          where: {
            triggerId: triggerDb.id,
            scheduledAt: nextTriggerDate
          },
          select: {
            id: true
          }
        });

        if (notificationExists) continue;

        if (!triggerDb.templateMessage)
          throw new AppError('Message template for trigger not found');

        const messageTemplate = messageTemplateMapper.map(triggerDb.templateMessage);
        const messageContent = messageTemplate.format(trigger.paramsValue);

        await db.notification.create({
          data: {
            id: idGen.new(),
            triggerId: triggerDb.id,
            accountId: triggerDb.contact.accountId,
            scheduledAt: nextTriggerDate,
            content: messageContent,
            sendedAt: null
          }
        });
      }

      if (triggers.length === 0 || triggers.length < limit)
        break;
    }
  }
}