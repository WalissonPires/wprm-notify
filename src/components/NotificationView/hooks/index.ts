'use client'

import z from "zod";
import { DateTime } from "luxon";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useForm, SubmitHandler,useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NotificationTriggersApi } from "@/domains/notification-triggers/client-api";
import { MessageTemplateParamType } from "@/domains/message-templates/entities";
import { TriggerType } from "@/domains/notification-triggers/entities";
import { DefaultParamsUtils } from "@/domains/message-templates/default-params";
import { messages } from "@/common/validation/messages";
import { AppError } from "@/common/error";
import { AppToast } from "@/common/ui/toast";
import { useMessageTemplates } from "./message-templates.hook";


export interface UseNotificationViewProps {
  contactId: string;
  triggerId?: string;
}

export function useNotificationView({ contactId, triggerId }: UseNotificationViewProps) {

  const [ isLoaded, setIsLoaded ] = useState(false);
  const [ isSaving, setIsLoading ] = useState(false);
  const { messageTemplates, isLoading: isLoadingMessageTemplates } = useMessageTemplates();
  const router = useRouter();

  const { register, handleSubmit, watch, setValue, getValues, reset, formState: { errors }, control } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      triggerType: TriggerType.Monthy,
    }
  });

  const messageTemplateParamsField = useFieldArray({
    name: 'messageTemplateParams',
    control
  });


  const [ templateMessageId, triggerType ] = watch(['templateMessageId', 'triggerType']);
  const messageTemplatedSelected = useMemo(() => messageTemplates.find(x => x.id === templateMessageId) ?? null, [ templateMessageId, messageTemplates ]);

  const onSubmit: SubmitHandler<ValidationSchema> = async data => {

    try {
      const api = new NotificationTriggersApi();
      setIsLoading(true);

      if (triggerId) {

        await api.update({
          triggerId: triggerId,
          contactId: contactId,
          templateMessageId: data.templateMessageId,
          day: (data.triggerType === TriggerType.Monthy || data.triggerType === TriggerType.Yearly) && data.day ? data.day : null,
          month: (data.triggerType === TriggerType.Yearly) && data.month ? data.month : null,
          type: data.triggerType,
          paramsValue: data.messageTemplateParams
        });

        AppToast.success('Notificação atualizada');

      } else {

        await api.register({
          contactId: contactId,
          templateMessageId: data.templateMessageId,
          day: (data.triggerType === TriggerType.Monthy || data.triggerType === TriggerType.Yearly) && data.day ? data.day : null,
          month: (data.triggerType === TriggerType.Yearly) && data.month ? data.month : null,
          type: data.triggerType,
          paramsValue: data.messageTemplateParams
        });

        AppToast.success('Notificação agendada');
      }

      router.back();
    }
    catch(e) {

      const error = AppError.parse(e);
      AppToast.error(error.message);
    }
    finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {

    if (triggerId) return;

    setIsLoaded(true);
  }, []);

  useEffect(() => {

    if (!triggerId || messageTemplates.length === 0) return;

    (async() => {

      const api = new NotificationTriggersApi();
      const trigger = await  api.getById({ id: triggerId });

      reset({
        day: trigger.day ?? undefined,
        month: trigger.month ?? undefined,
        triggerType: trigger.type as any,
        templateMessageId: trigger.templateMessage?.id,
        messageTemplateParams: trigger.paramsValue
      });

      setIsLoaded(true);

    })();

  }, [ triggerId, messageTemplates ]);

  useEffect(() => {

    if (!messageTemplatedSelected) return;

    const defaultParamsUtils = new DefaultParamsUtils();
    const defaultParams = Object.values(defaultParamsUtils.getAllParamsDefaultLanguage());
    const { messageTemplateParams } = getValues();

    messageTemplateParamsField.replace(messageTemplatedSelected?.params.map(param => ({
      type: param.type,
      name: param.name,
      value: defaultParams.includes(param.name) || param.type !== MessageTemplateParamType.Text ? DefaultParamValue : (messageTemplateParams.find(x => x.name === param.name)?.value ?? '')
    })) ?? []);

  }, [ messageTemplatedSelected ]);

  useEffect(() => {

    const subscription = watch((data, { name, type,  }) => {

      if (name === 'triggerType') {

        if (data.triggerType === TriggerType.Daily) {
          setValue('day', undefined, { shouldValidate: true });
          setValue('month', undefined, { shouldValidate: true });
        }

        if (data.triggerType === TriggerType.Monthy) {
          setValue('month', undefined, { shouldValidate: true });
        }
      }
    });

    return () => subscription.unsubscribe();

  }, [ watch, setValue ]);

  return {
    handleSubmit: handleSubmit(onSubmit),
    register,
    isLoadingMessageTemplates,
    isSaving,
    isLoaded,
    values: {
      templateMessageId,
      triggerType
    },
    errors,
    control,
    messageTemplateParamsField,
    messageTemplates,
    messageTemplatedSelected
  };
}

export const DefaultParamValue = '[Preenchido pelo sistema]';


const baseValidationSchema = z.object({
  templateMessageId: z.string().min(1, { message: messages.required }),
  triggerType: z.nativeEnum(TriggerType),
  messageTemplateParams: z.array(z.object({
    name: z.string().min(1, { message: messages.required }),
    value: z.string().min(1, { message: messages.required }),
    type: z.nativeEnum(MessageTemplateParamType)
  })),
  day: z.coerce.number().optional(),
  month: z.coerce.number().optional(),
}).refine(obj => {

  return obj.day && obj.month ? DateTime.fromISO(`2024-${obj.month.toString().padStart(2, '0')}-${obj.day.toString().padStart(2, '0')}`).isValid : true;
}, {
  message: 'Dia inválido para o mês selecionado',
  path: [ 'day' ]
});

const dailyValidationSchema = z.object({
  triggerType: z.literal(TriggerType.Daily)
});

const monthlyValidationSchema = z.object({
  triggerType: z.literal(TriggerType.Monthy),
  day: z.coerce.number().min(1).max(31)
});

const yearlyValidationSchema = z.object({
  triggerType: z.literal(TriggerType.Yearly),
  day: z.coerce.number().min(1).max(31),
  month: z.coerce.number().min(1).max(12),
});

const validationSchema = z.intersection(baseValidationSchema, z.discriminatedUnion('triggerType', [ dailyValidationSchema, monthlyValidationSchema, yearlyValidationSchema ]));

type ValidationSchema = z.infer<typeof validationSchema>;