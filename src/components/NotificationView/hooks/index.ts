'use client'

import z from "zod";
import { useEffect, useMemo, useState } from "react";
import { useForm, SubmitHandler,useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NotificationTriggersApi } from "@/domains/notification-triggers/client-api";
import { TriggerType } from "@/domains/notification-triggers/entities";
import { messages } from "@/common/validation/messages";
import { AppError } from "@/common/error";
import { AppToast } from "@/common/ui/toast";
import { useMessageTemplates } from "./message-templates.hook";


export interface UseNotificationViewProps {
  contactId: string;
}

export function useNotificationView({ contactId }: UseNotificationViewProps) {

  const [ isSaving, setIsLoading ] = useState(false);
  const { messageTemplates, isLoading: isLoadingMessageTemplates } = useMessageTemplates();

  const { register, handleSubmit, watch, setValue, formState: { errors }, control } = useForm<ValidationSchema>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      triggerType: TriggerType.Monthy,
    }
  });

  const messageTemplateParamsField = useFieldArray({
    name: 'messageTemplateParams',
    control
  });


  const values = watch();
  const messageTemplatedSelected = useMemo(() => messageTemplates.find(x => x.id === values.templateMessageId) ?? null, [ values.templateMessageId, messageTemplates ]);

  const onSubmit: SubmitHandler<ValidationSchema> = async data => {

    try {
      const api = new NotificationTriggersApi();
      setIsLoading(true);

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
    catch(e) {

      const error = AppError.parse(e);
      AppToast.error(error.message);
    }
    finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {

    if (!messageTemplatedSelected) return;

    messageTemplateParamsField.replace(messageTemplatedSelected?.params.map(param => ({
      name: param.name,
      value: ''
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
    values,
    errors,
    control,
    messageTemplateParamsField,
    messageTemplates,
    messageTemplatedSelected
  };
}


const baseValidationSchema = z.object({
  templateMessageId: z.string().min(1, { message: messages.required }),
  triggerType: z.nativeEnum(TriggerType),
  messageTemplateParams: z.array(z.object({
    name: z.string().min(1, { message: messages.required }),
    value: z.string().min(1, { message: messages.required })
  })),
  day: z.coerce.number().optional(),
  month: z.coerce.number().optional(),
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