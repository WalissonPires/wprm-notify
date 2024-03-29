import { DateTime } from 'luxon';
import { AppError } from "@/common/error";
import { MessageTemplateParamType } from '../message-templates/entities';

export class Trigger {

  private _fields: TriggerProps;

  get id() {

    return this._fields.id;
  }

  get paramsValue() {

    return this._fields.paramsValue;
  }

  constructor(props: TriggerProps) {

    this._fields = { ...props };

    if (this._fields.day !== null && this._fields.day !== undefined) {

      const day = Number(this._fields.day);
      if (isNaN(day))
        throw new AppError('Day is not valid');

      if (day < 1 || day > 31)
        throw new AppError('Day must be between 1 and 31');
    }
    else if (this._fields.type === TriggerType.Monthy) {
      throw new AppError('Day must be informed for monthly type triggers');
    }
    else if (this._fields.type === TriggerType.Yearly) {
      throw new AppError('Day must be informed for yearly type triggers');
    }

    if (this._fields.month !== null && this._fields.month !== undefined) {

      const month = Number(this._fields.month);
      if (isNaN(month))
        throw new AppError('Month is not valid');

      if (month < 1 || month > 12)
        throw new AppError('Month must be between 1 and 12');
    }
    else if (this._fields.type === TriggerType.Yearly) {
      throw new AppError('Month must be informed for yearly type triggers');
    }
  }

  nextTriggerDate(): Date {

    const zone = 'America/Sao_Paulo'; // [ToDo] get user timezone
    const currentDate = DateTime.now().setZone(zone);

    if (this._fields.type === TriggerType.Daily) {
      return currentDate.plus({ day: 1 }).startOf('day').toJSDate();
    }

    if (this._fields.type === TriggerType.Monthy) {

      if (!this._fields.day)
        throw new AppError('Day must be informed for monthly type triggers');

      let day = this._fields.day;

      const lastDayDate = currentDate.endOf('month');

      if (day > lastDayDate.day)
        day = lastDayDate.day;

      let nextTriggerDate = DateTime.fromObject({
        day: day,
        month: currentDate.month,
        year: currentDate.year,
      }, { zone });

      if (nextTriggerDate < currentDate)
        nextTriggerDate = nextTriggerDate.plus({ month: 1 });

        if (this._fields.notifyDaysBefore)
          nextTriggerDate = nextTriggerDate.minus({ days: this._fields.notifyDaysBefore });

      return nextTriggerDate.startOf('day').toJSDate();
    }

    if (this._fields.type === TriggerType.Yearly) {

      if (!this._fields.day)
        throw new AppError('Day must be informed for yearly type triggers');

      if (!this._fields.month)
        throw new AppError('Month must be informed for yearly type triggers');

      let nextTriggerDate = DateTime.fromObject({
        day: this._fields.day,
        month: this._fields.month,
        year: currentDate.year
      }, { zone });

      if (nextTriggerDate < currentDate)
        nextTriggerDate = nextTriggerDate.plus({ year: 1 });

      if (this._fields.notifyDaysBefore)
        nextTriggerDate = nextTriggerDate.minus({ days: this._fields.notifyDaysBefore });

      return nextTriggerDate.startOf('day').toJSDate();
    }

    throw new AppError('Invalid trigger type: ' + this._fields.type);
  }

  toString() {

    let info = TriggerTypeDisplay[this._fields.type];

    if (this._fields.day)
      info += ', todo dia ' + this._fields.day.toString().padStart(2, '0');

    if (this._fields.month)
      info += ' de ' + DateTime.fromObject({ day: 1, month: this._fields.month, year: 2024 }).setLocale('pt').monthLong;

    return info;
  }
}

export interface TriggerProps {
  id: string;
  type: TriggerType;
  day: number | null;
  month: number | null;
  notifyDaysBefore: number | null;
  paramsValue: TriggerParamValue[];
}

export enum TriggerType {
  Daily = 'daily',
  Monthy = 'monthy',
  Yearly = 'yearly'
}

export const TriggerTypeDisplay = {
  [TriggerType.Daily]: 'Diário',
  [TriggerType.Monthy]: 'Mensal',
  [TriggerType.Yearly]: 'Anual'
}

export interface TriggerParamValue {
  name: string;
  type: MessageTemplateParamType;
  value: string;
}

export interface Trigger1 {
  id: string;
  type: TriggerType;
  day: number | null;
  month: number | null;
  paramsValue: TriggerParamValue[];
  templateMessage: {
    id: string;
    name: string;
  } | null;
}
