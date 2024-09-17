import z from "zod";
import { AppError } from "@/common/error";
import { UseCase } from "@/common/use-cases";
import { messages } from "@/common/validation/messages";
import { UserLogged } from "@/common/auth/user";
import { PrismaClient } from "@prisma/client";
import { Trigger, TriggerType } from "../entities";
import { TriggerMapper } from "../mapper";
import { UpdateNotificationTriggerInput } from "./update-notification-trigger-types";

export class UpdateNotificationTrigger implements UseCase<UpdateNotificationTriggerInput, Trigger> {

  private _user: UserLogged;
  private _db: PrismaClient;

  constructor({ userLogged, prismaClient }: { userLogged: UserLogged, prismaClient: PrismaClient }) {

    this._user = userLogged;
    this._db = prismaClient;
  }

  public async execute(input: UpdateNotificationTriggerInput): Promise<Trigger> {

    this.validate(input);

    const triggerMapper = new TriggerMapper();

    const triggerExists = await this._db.notificationTrigger.findFirst({
      where: {
        contactId: input.contactId,
        templateMessageId: input.templateMessageId,
        type: triggerMapper.mapTriggerType2(input.type),
        day: input.day,
        month: input.month,
        id: {
          not: input.triggerId
        }
      },
      select: {
        id: true
      }
    });

    if (triggerExists) {
      throw new AppError('Existe outra notificação para o dia informado');
    }

    await this._db.$transaction(async transaction => {

      await this._db.notificationTrigger.update({
        where: { id: input.triggerId },
        data: {
          templateMessageId: input.templateMessageId,
          contactId: input.contactId,
          type: triggerMapper.mapTriggerType2(input.type),
          day: input.day,
          month: input.month,
          paramsValue: JSON.stringify(input.paramsValue ?? [])
        }
      });

      await transaction.notification.deleteMany({
        where: {
          accountId: this._user.accountId,
          triggerId: input.triggerId,
          sendedAt: null,
        }
      });

    });

    const triggerDb = await this._db.notificationTrigger.findFirst({
      where: {
        id: input.triggerId
      },
      include: {
        templateMessage: true
      }
    });

    return triggerMapper.map(triggerDb!);
  }

  private validate(input: UpdateNotificationTriggerInput) {

    const baseValidationSchema = z.object({
      triggerId: z.string().min(1, { message: messages.required }),
      templateMessageId: z.string().min(1, { message: messages.required }),
      contactId: z.string().min(1, { message: messages.required }),
      type: z.nativeEnum(TriggerType),
      paramsValue: z.array(z.object({
        name: z.string().min(1, { message: messages.required }),
        value: z.string().min(1, { message: messages.required })
      })),
      day: z.coerce.number().optional(),
      month: z.coerce.number().optional(),
    });

    const dailyValidationSchema = z.object({
      type: z.literal(TriggerType.Daily)
    });

    const monthlyValidationSchema = z.object({
      type: z.literal(TriggerType.Monthy),
      day: z.coerce.number().min(1).max(31)
    });

    const yearlyValidationSchema = z.object({
      type: z.literal(TriggerType.Yearly),
      day: z.coerce.number().min(1).max(31),
      month: z.coerce.number().min(1).max(12),
    });

    const validationSchema = z.intersection(baseValidationSchema, z.discriminatedUnion('type', [ dailyValidationSchema, monthlyValidationSchema, yearlyValidationSchema ]));

    const result = validationSchema.safeParse(input);

    if (result.success)
      return;

    throw AppError.fromZodError(result.error);
  }
}