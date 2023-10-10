import { NotificationTrigger as NotificationTriggerDb, TriggerType as TriggerTypeDb } from "@prisma/client";
import { AppError } from "@/common/error";
import { Trigger, TriggerType } from "./entities";


export class TriggerMapper {

  public map(triggerDb: NotificationTriggerDb): Trigger {

    const trigger = new Trigger({
      day: triggerDb.day,
      month: triggerDb.month,
      type: this.mapTriggerType(triggerDb.type),
      paramsValue: triggerDb.paramsValue ? JSON.parse(triggerDb.paramsValue) : {}
    });

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
}