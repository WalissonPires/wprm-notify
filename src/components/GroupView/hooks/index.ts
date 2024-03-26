import z from "zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { messages } from "@/common/validation/messages";
import { AppToast } from "@/common/ui/toast";
import { AppError } from "@/common/error";
import { useLoading } from "@/components/AppLayout/Loading/hooks";
import { GroupsApi } from "@/domains/groups/client-api";

export interface UseGroupArgs {
  groupId?: string;
}

export function useGroup(args: UseGroupArgs) {

  const router = useRouter();
  const [ isSaving, setIsSaving ] = useState(false);
  const { setLoading } = useLoading();

  const { register, handleSubmit, watch, setValue, formState: { errors }, control } = useForm<Model>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      name: '',
      color: undefined
    }
  });


  const onSubmit: SubmitHandler<Model> = async (data) => {

    try {
      const api = new GroupsApi();
      setIsSaving(true);

      if (args.groupId) {

        await api.update({
          group: {
            id: args.groupId,
            name: data.name,
            color: data.color
          }
        });
      }
      else {

        await api.create({
          group: {
            name: data.name,
            color: data.color
          }
        });
      }

      AppToast.success('Grupo salvo');

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


  useEffect(() => {

    if (!args.groupId)
      return;

    const groupId = args.groupId;

    const execute = async () => {

      setLoading(true);
      try {
        const group = await new GroupsApi().getById(groupId);

        setValue('name', group.name);
        setValue('color', group.color);
      }
      catch(error) {
        AppToast.error(AppError.parse(error).message);
      }
      finally {
        setLoading(false);
      }
    }

    execute();

  }, [ args.groupId ]);


  return {
    handleSubmit: handleSubmit(onSubmit),
    register,
    isSaving,
    errors,
    control
  };
}

const validationSchema = z.object({
  name: z.string().max(30).min(1, { message: messages.required }),
  color: z.string().max(7).min(1, { message: messages.required })
});

type Model = z.infer<typeof validationSchema>;