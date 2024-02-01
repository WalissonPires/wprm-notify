import { Contact as ContactDb, NotificationTrigger as NotificationTriggerDb, TemplateMessage as TemplateMessageDb } from "@prisma/client";
import { IdGenerator } from "@/common/identity/generate";
import { UseCase } from "@/common/use-cases";
import { AppError } from "@/common/error";
import { LoggerFactory } from "@/common/logger";
import { PrismaClientFactory } from "@/common/database/prisma-factory";
import { TriggerMapper } from "../../notification-triggers/mapper";
import { MessageTemplateMapper } from "../../message-templates/mapper";
import { DefaultParamsReplace } from "../../message-templates/default-params-replace";


export class GenerateNotificationsByTriggers implements UseCase<GenerateNotificationsByTriggersInput, void> {

  public async execute(args: GenerateNotificationsByTriggersInput): Promise<void> {

    const db = PrismaClientFactory.create();
    const logger = new LoggerFactory().createLogger({ scope: GenerateNotificationsByTriggers.name });

    logger.debug('Start task generate notifications by triggers');

    const limit = 100;
    let offset = 0;

    const triggerMapper = new TriggerMapper();
    const messageTemplateMapper = new MessageTemplateMapper();
    const idGen = new IdGenerator();
    const defaultParamsReplace = new DefaultParamsReplace();

    while (true) {

      let triggers: TriggerDbSelected[] = [];

      if (args.triggerId) {

        logger.debug(`Executing only for trigger ${args.triggerId}`);

        triggers = await db.notificationTrigger.findMany({
          where: {
            id: args.triggerId
          },
          include: {
            contact: {
              select: {
                accountId: true,
                name: true
              }
            },
            templateMessage: true
          }
        });
      }
      else {

        logger.debug('Executing for all accounts');

        triggers = await db.notificationTrigger.findMany({
          skip: offset,
          take: limit,
          include: {
            contact: {
              select: {
                accountId: true,
                name: true
              }
            },
            templateMessage: true
          }
        });
      }

      logger.debug(`Get triggers ${offset}/${limit}. Found: ${triggers.length}`);

      offset += limit;

      for(const triggerDb of triggers) {

        logger.debug(`Check trigger ${triggerDb.id}`);

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

        if (notificationExists) {
          logger.debug(`Notification exists for trigger ${triggerDb.id}`);
          continue;
        }

        if (!triggerDb.templateMessage)
          throw new AppError('Message template for trigger not found');

        const messageTemplate = messageTemplateMapper.map(triggerDb.templateMessage);

        const defaultParamsWithValues = defaultParamsReplace.replace({
          params: trigger.paramsValue,
          contact: triggerDb.contact ?? null
        });
        const restParamsWithValues = trigger.paramsValue.filter(tParam => !defaultParamsWithValues.some(dParam => dParam.name === tParam.name));
        const paramsWithValues = defaultParamsWithValues.concat(restParamsWithValues);
        const messageContent = messageTemplate.format(paramsWithValues);

        logger.debug(`Creating notification for trigger ${triggerDb.id}`);

        await db.notification.create({
          data: {
            id: idGen.new(),
            triggerId: triggerDb.id,
            contactId: triggerDb.contactId,
            accountId: triggerDb.contact.accountId,
            scheduledAt: nextTriggerDate,
            content: messageContent,
            createdAt: new Date(),
            sendedAt: null,
            notes: `Agendamento ${trigger.toString()} usando modelo de mensagem "${triggerDb.templateMessage.name}".`
          }
        });

        logger.debug(`Notification created for trigger ${triggerDb.id} scheduled at ${nextTriggerDate.toISOString()}`);
      }


      if (triggers.length === 0 || triggers.length < limit)
        break;
    }

    logger.debug('End task generate notifications by triggers');
  }
}

export interface GenerateNotificationsByTriggersInput {
  triggerId?: string;
}

type TriggerDbSelected = NotificationTriggerDb & {
  contact: Pick<ContactDb, 'accountId' | 'name'>;
  templateMessage: TemplateMessageDb | null;
}