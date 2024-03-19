import z from "zod";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { messages } from "@/common/validation/messages";
import { MessageTemplatesApi } from "@/domains/message-templates/client-api";
import { MessageTemplateParamType } from "@/domains/message-templates/entities";
import { makeDataUrl, parseDataUrl } from "@/common/primitives/file/data-url";
import { getBase64BytesSize } from "@/common/primitives/file/file-size";
import { AppToast } from "@/common/ui/toast";
import { AppError } from "@/common/error";
import { IdGenerator } from "@/common/identity/generate";
import { useLoading } from "@/components/AppLayout/Loading/hooks";

export interface UseMessageTemplateArgs {
  messateTemplateId?: string;
}

export function useMessageTemplate(args: UseMessageTemplateArgs) {

  const router = useRouter();
  const [ isSaving, setIsSaving ] = useState(false);
  const { setLoading } = useLoading();

  const { register, handleSubmit, watch, setValue, formState: { errors }, control } = useForm<Model>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      name: '',
      notifyDaysBefore: undefined,
      message: {
        content: '',
        medias: []
      }
    }
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
            content: data.message.content,
            notifyDaysBefore: data.notifyDaysBefore ? data.notifyDaysBefore : undefined,
            params: data.message.medias.map(media => ({
              type: MessageTemplateParamType.File,
              name: media.filename,
              value: media.fileBase64 ? makeDataUrl({ mimeType: media.mimeType, base64: media.fileBase64 }) : ''
            }))
          }
        });
      }
      else {

        await api.create({
          messageTemplate: {
            name: data.name,
            content: data.message.content,
            notifyDaysBefore: data.notifyDaysBefore ? data.notifyDaysBefore : undefined,
            params: data.message.medias.map(media => ({
              type: MessageTemplateParamType.File,
              name: media.filename,
              value: makeDataUrl({ mimeType: media.mimeType, base64: media.fileBase64 })
            }))
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


  const content = watch('message.content');
  const paramsNames = useMemo(() => {

    if (!content) return [];

    let names = Array.from(content.matchAll(/{{([a-zA-Z\d_]+)}}/g)).map(match => match[1]);
    names = Array.from(new Set(names));

    return names;

  },[ content ]);


  useEffect(() => {

    if (!args.messateTemplateId)
      return;

    const messageTemplateId = args.messateTemplateId;

    const execute = async () => {

      setLoading(true);
      try {
        const messageTemplate = await new MessageTemplatesApi().getById(messageTemplateId);

        setValue('name', messageTemplate.name);
        setValue('notifyDaysBefore', messageTemplate.notifyDaysBefore ?? undefined);
        setValue('message', {
          content: messageTemplate.content,
          medias: messageTemplate.params.filter(x => x.type === MessageTemplateParamType.File).map(param => {

            const dataUrl = param.value ? parseDataUrl(param.value) : null;

            const media: MediaModel = {
              id: new IdGenerator().new(),
              mimeType: dataUrl?.mimeType ?? '',
              filename: param.name,
              fileBase64: dataUrl?.base64 ?? '',
              fileSize: dataUrl ? getBase64BytesSize(dataUrl.base64) : 0,
              fileUrl: MessageTemplatesApi.makeParamUrl({ messageTemplateId: messageTemplate.id, paramName: param.name })
            };

            return media;

          }).filter(media => media !== null)
        });
      }
      catch(error) {
        AppToast.error(AppError.parse(error).message);
      }
      finally {
        setLoading(false);
      }
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
  notifyDaysBefore: z.coerce.number().gte(0).optional(),
  message: z.object({
    content: z.string().max(2000).min(1, { message: messages.required }),
    medias: z.array(z.object({
      id: z.string(),
      mimeType: z.string(),
      fileBase64: z.string(),
      filename: z.string(),
      fileSize: z.number(),
      fileUrl: z.string().optional()
    }))
  })
});

type Model = z.infer<typeof validationSchema>;
type MediaModel = Model['message']['medias'][0];