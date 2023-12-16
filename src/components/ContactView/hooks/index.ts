import z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { messages } from "@/common/validation/messages";
import { ContactsApi } from "@/domains/contacts/client-api";
import { AppToast } from "@/common/ui/toast";
import { AppError } from "@/common/error";
import { Masks } from "@/common/validation/masks";
import { useGroups } from "../../Groups/hooks";
import { unmaskValue } from "../../Form";


export function useContactView() {

  const router = useRouter();
  const [ isSaving, setIsSaving ] = useState(false);
  const { groups, isLoading: isLoadingGroups } = useGroups();

  const { register, handleSubmit, formState: { errors }, control } = useForm<Model>({
    resolver: zodResolver(validationSchema)
  });

  const onSubmit: SubmitHandler<Model> = async (data) => {

    try {
      const api = new ContactsApi();
      setIsSaving(true);

      await api.create({
        contact: {
          name: data.name,
          phone: data.phone,
          email: data.email,
          groupsId: data.groupsId
        }
      });

      AppToast.success('Contato criado');

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

  return {
    handleSubmit: handleSubmit(onSubmit),
    register,
    isSaving,
    isLoadingGroups,
    errors,
    control,
    groups
  };
}

const validationSchema = z.object({
  name: z.string().max(40).min(1, { message: messages.required }),
  phone: z.string().max(16, { message: messages.invalid }).min(16, { message: messages.invalid }).transform(phone => unmaskValue(phone, { mask: Masks.phone })).or(z.literal('').transform(_ => undefined)),
  email: z.string().email().max(60).optional().or(z.literal('').transform(_ => undefined)),
  groupsId: z.array(z.string().min(1, { message: messages.required })).min(1)
});

type Model = z.infer<typeof validationSchema>;