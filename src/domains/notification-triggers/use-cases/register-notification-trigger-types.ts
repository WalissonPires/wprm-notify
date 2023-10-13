import { TriggerParamValue, TriggerType } from "../entities";

export interface RegisterNotificationTriggerInput {
  templateMessageId: string;
  contactId: string;
  type: TriggerType;
  day: number | null;
  month: number | null;
  paramsValue: TriggerParamValue[];
}