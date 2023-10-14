import { NotificationTrigger as NotificationTriggerDb, TemplateMessage as TemplateMessageDb, TriggerType as TriggerTypeDb } from "@prisma/client";
import { AppError } from "@/common/error";
import { Trigger, Trigger1, TriggerType } from "./entities";


export class TriggerMapper {

  public map(triggerDb: NotificationTriggerDb): Trigger {

    const trigger = new Trigger({
      id: triggerDb.id,
      day: triggerDb.day,
      month: triggerDb.month,
      type: this.mapTriggerType(triggerDb.type),
      paramsValue: triggerDb.paramsValue ? JSON.parse(triggerDb.paramsValue) : {}
    });

    return trigger;
  }

  public mapToView1(triggerDb: NotificationTriggerDb1): Trigger1 {

    const trigger: Trigger1 = {
      id: triggerDb.id,
      day: triggerDb.day,
      month: triggerDb.month,
      type: this.mapTriggerType(triggerDb.type),
      paramsValue: triggerDb.paramsValue ? JSON.parse(triggerDb.paramsValue) : {},
      templateMessage: triggerDb.templateMessage ? {
        id: triggerDb.templateMessage.id,
        name: triggerDb.templateMessage.name
      } : null
    };

    return trigger;
  }

  public mapTriggerType(type: TriggerTypeDb): TriggerType {

    const map: Record<TriggerTypeDb, TriggerType> = {
      Daily: TriggerType.Daily,
      Monthy: TriggerType.Monthy,
      Yearly: TriggerType.Yearly
    };

    const typeMapped = map[type];

    if (typeMapped === undefined)
      throw new AppError('Invalid type: ' + type);

      return typeMapped;
  }

  public mapTriggerType2(type: TriggerType): TriggerTypeDb {

    const map: Record<TriggerType, TriggerTypeDb> = {
      daily: TriggerTypeDb.Daily,
      monthy: TriggerTypeDb.Monthy,
      yearly: TriggerTypeDb.Yearly
    };

    const typeMapped = map[type];

    if (typeMapped === undefined)
      throw new AppError('Invalid type: ' + type);

      return typeMapped;
  }
}

type NotificationTriggerDb1 = NotificationTriggerDb & {
  templateMessage: Pick<TemplateMessageDb, 'id' | 'name'> | null;
}