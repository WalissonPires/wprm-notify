import z from "zod";
import { useState, useRef, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { messages } from "@/common/validation/messages";
import { AppToast } from "@/common/ui/toast";
import { AppError } from "@/common/error";
import { MessagesApi } from "@/domains/messages/client-api";
import { JobsApi } from "@/domains/jobs/client-api";
import { Job } from "@/domains/jobs/job-types";
import { useGroups } from "../../Groups/hooks";

export function useSendMessageView() {

  const [ isSaving, setIsSaving ] = useState(false);
  const { groups, isLoading: isLoadingGroups } = useGroups();
  const [ activeJob, setActiveJob ] = useState<Job | null>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

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

  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, []);

  const startPolling = (jobId: string) => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }

    const jobsApi = new JobsApi();

    pollIntervalRef.current = setInterval(async () => {
      try {
        const job = await jobsApi.getStatus(jobId);
        setActiveJob(job);

        if (job.status === 'completed' || job.status === 'failed') {
          if (pollIntervalRef.current) {
            clearInterval(pollIntervalRef.current);
            pollIntervalRef.current = null;
          }
          setIsSaving(false);
          if (job.status === 'completed') {
            AppToast.success('Envio em lote finalizado com sucesso!');
          } else {
            AppToast.error(`Envio em lote falhou: ${job.error || 'Erro desconhecido'}`);
          }
        }
      } catch (e) {
        console.error('Error polling job status:', e);
      }
    }, 1000);
  };

  const onSubmit: SubmitHandler<Model> = async (data) => {

    try {
      const api = new MessagesApi();
      setIsSaving(true);
      setActiveJob(null);

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

      setActiveJob({
        id: result.jobId,
        accountId: '',
        type: 'send-message',
        status: 'pending',
        progress: {
          total: 0,
          success: 0,
          failed: 0
        },
        createdAt: new Date()
      });

      startPolling(result.jobId);
    }
    catch(e) {

      const error = AppError.parse(e);
      AppToast.error(error.getExtendedMessage());
      setIsSaving(false);
    }
  };

  return {
    handleSubmit: handleSubmit(onSubmit),
    register,
    isSaving,
    isLoadingGroups,
    errors,
    control,
    groups,
    activeJob
  };
}

const validationSchema = z.object({
  groupsId: z.array(z.string().min(1, { message: messages.required })).min(1),
  message: z.object({
    content: z.string().max(2000).min(1, { message: messages.required }),
    medias: z.array(z.object({
      id: z.string(),
      mimeType: z.string(),
      fileBase64: z.string(),
      filename: z.string(),
      fileSize: z.number()
    }))
  })
});

type Model = z.infer<typeof validationSchema>;