import z from "zod";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { messages } from "@/common/validation/messages";
import { MessageTemplatesApi } from "@/domains/message-templates/client-api";
import { AppToast } from "@/common/ui/toast";
import { AppError } from "@/common/error";


export function useMessageTemplate() {

  const router = useRouter();
  const [ isSaving, setIsSaving ] = useState(false);

  const { register, handleSubmit, watch, formState: { errors }, control } = useForm<Model>({
    resolver: zodResolver(validationSchema)
  });

  const onSubmit: SubmitHandler<Model> = async (data) => {

    try {
      const api = new MessageTemplatesApi();
      setIsSaving(true);

      await api.create({
        messageTemplate: {
          name: data.name,
          content: data.content
        }
      });

      AppToast.success('Modelo de mensagem criado');

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
  content: z.string().max(2000).min(3)
});

type Model = z.infer<typeof validationSchema>;