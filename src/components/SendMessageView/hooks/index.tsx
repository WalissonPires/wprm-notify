import z from "zod";
import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { messages } from "@/common/validation/messages";
import { AppToast } from "@/common/ui/toast";
import { AppError } from "@/common/error";
import { MessagesApi } from "@/domains/messages/client-api";
import { SendMessageResult } from "@/domains/messages/use-cases/send-message-types";
import { useGroups } from "../../Groups/hooks";

export function useSendMessageView() {

  const [ isSaving, setIsSaving ] = useState(false);
  const { groups, isLoading: isLoadingGroups } = useGroups();
  const [ lastResult, setLastResult ] = useState<SendResult | null>(null);
  const [ showResultDetails, setShowResultDetails ] = useState(false);

  const { register, handleSubmit, setValue, formState: { errors }, control } = useForm<Model>({
    resolver: zodResolver(validationSchema),
    values: {
      groupsId: [],
      message: {
        content: '',
        medias: []
      }
    }
  });

  const onSubmit: SubmitHandler<Model> = async (data) => {

    try {
      const api = new MessagesApi();
      setIsSaving(true);
      setShowResultDetails(false);
      setLastResult(null);

      const result = await api.send({
        groupsId: data.groupsId,
        message: {
          content: data.message.content,
          medias: data.message.medias.map(media => ({
            mimeType: media.mimeType,
            fileBase64: media.fileBase64
          }))
        }
      });

      setLastResult({
        sendedCount: result.contacts.filter(x => x.isSended).length,
        errorCount: result.contacts.filter(x => !x.isSended).length,
        contacts: result.contacts
      });

      setShowResultDetails(false);
    }
    catch(e) {

      const error = AppError.parse(e);
      AppToast.error(error.getExtendedMessage());
    }
    finally {
      setIsSaving(false);
    }
  };

  return {
    handleSubmit: handleSubmit(onSubmit),
    handleShowResultDetails: () => setShowResultDetails(true),
    register,
    isSaving,
    isLoadingGroups,
    errors,
    control,
    groups,
    lastResult,
    showResultDetails
  };
}

const validationSchema = z.object({
  groupsId: z.array(z.string().min(1, { message: messages.required })).min(1),
  message: z.object({
    content: z.string().max(2000).min(1, { message: messages.required }),
    medias: z.array(z.object({
      mimeType: z.string(),
      fileBase64: z.string(),
      filename: z.string()
    }))
  })
});

type Model = z.infer<typeof validationSchema>;

interface SendResult {
  sendedCount: number;
  errorCount: number;
  contacts: SendMessageResult['contacts'];
}