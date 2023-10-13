import z from "zod";
import { PrismaClient } from "@prisma/client";
import { UseCase } from "@/common/use-cases";
import { IdGenerator } from "@/common/identity/generate";
import { Trigger, TriggerType } from "../entities";
import { TriggerMapper } from "../mapper";
import { RegisterNotificationTriggerInput } from "./register-notification-trigger-types";
import { messages } from "@/common/validation/messages";
import { AppError } from "@/common/error";

export class RegisterNotificationTrigger implements UseCase<RegisterNotificationTriggerInput, Trigger> {

  public async execute(input: RegisterNotificationTriggerInput): Promise<Trigger> {

    this.validate(input);

    const db = new PrismaClient();
    const idGen = new IdGenerator();
    const triggerMapper = new TriggerMapper();

    const triggerExists = await db.notificationTrigger.findFirst({
      where: {
        contactId: input.contactId,
        templateMessageId: input.templateMessageId,
        type: triggerMapper.mapTriggerType2(input.type),
        day: input.day,
        month: input.month
      },
      select: {
        id: true
      }
    });

    if (triggerExists) {
      throw new AppError('Notificação já registrada');
    }

    const triggerDb = await db.notificationTrigger.create({
      data: {
        id: idGen.new(),
        templateMessageId: input.templateMessageId,
        contactId: input.contactId,
        type: triggerMapper.mapTriggerType2(input.type),
        day: input.day,
        month: input.month,
        paramsValue: JSON.stringify(input.paramsValue ?? [])
      }
    });

    return triggerMapper.map(triggerDb);
  }

  private validate(input: RegisterNotificationTriggerInput) {

    const baseValidationSchema = z.object({
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

    const validation = result.error.errors.reduce((obj, error) => {

      obj[error.path.join('.')] = [ error.message ];

      return obj;

    }, {} as Record<string, string[]>);

    throw new AppError(AppError.invalidFieldsMessage, validation);
  }
}