import { TriggerParamValue, TriggerType } from "../entities";

export interface UpdateNotificationTriggerInput {
  triggerId: string;
  templateMessageId: string;
  contactId: string;
  type: TriggerType;
  day: number | null;
  month: number | null;
  paramsValue: TriggerParamValue[];
}