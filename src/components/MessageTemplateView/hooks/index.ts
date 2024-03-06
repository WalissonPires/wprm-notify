import z, { string } from "zod";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { messages } from "@/common/validation/messages";
import { MessageTemplatesApi } from "@/domains/message-templates/client-api";
import { AppToast } from "@/common/ui/toast";
import { AppError } from "@/common/error";

export interface UseMessageTemplateArgs {
  messateTemplateId?: string;
}

export function useMessageTemplate(args: UseMessageTemplateArgs) {

  const router = useRouter();
  const [ isSaving, setIsSaving ] = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors }, control } = useForm<Model>({
    resolver: zodResolver(validationSchema)
  });


  const onSubmit: SubmitHandler<Model> = async (data) => {

    try {
      const api = new MessageTemplatesApi();
      setIsSaving(true);

      if (args.messateTemplateId) {

        await api.update({
          messageTemplate: {
            id: args.messateTemplateId,
            name: data.name,
            content: data.content,
            notifyDaysBefore: data.notifyDaysBefore ? data.notifyDaysBefore : undefined
          }
        });
      }
      else {

        await api.create({
          messageTemplate: {
            name: data.name,
            content: data.content,
            notifyDaysBefore: data.notifyDaysBefore ? data.notifyDaysBefore : undefined
          }
        });
      }

      AppToast.success('Modelo de mensagem salvo');

      router.back();
    }
    catch(e) {

      const error = AppError.parse(e);
      AppToast.error(error.message);
    }
    finally {
      setIsSaving(false);
    }
  };


  const content = watch('content');
  const paramsNames = useMemo(() => {

    if (!content) return [];

    let names = Array.from(content.matchAll(/{{([a-zA-Z\d_]+)}}/g)).map(match => match[1]);
    names = Array.from(new Set(names));

    return names;

  },[ content ]);


  useEffect(() => {

    if (!args.messateTemplateId)
      return;

    const contactId = args.messateTemplateId;

    const execute = async () => {

      const messageTemplate = await new MessageTemplatesApi().getById(contactId);

      setValue('name', messageTemplate.name);
      setValue('content', messageTemplate.content);
      setValue('notifyDaysBefore', messageTemplate.notifyDaysBefore ?? undefined);
    }

    execute();

  }, [ args.messateTemplateId ]);


  return {
    handleSubmit: handleSubmit(onSubmit),
    register,
    isSaving,
    errors,
    control,
    paramsNames
  };
}

const validationSchema = z.object({
  name: z.string().max(100).min(1, { message: messages.required }),
  content: z.string().max(2000).min(3),
  notifyDaysBefore: z.coerce.number().gte(0).optional()
});

type Model = z.infer<typeof validationSchema>;