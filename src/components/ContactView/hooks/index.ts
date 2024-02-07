import z from "zod";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { messages } from "@/common/validation/messages";
import { ContactsApi } from "@/domains/contacts/client-api";
import { AppToast } from "@/common/ui/toast";
import { AppError } from "@/common/error";
import { Masks, MasksUtils } from "@/common/validation/masks";
import { useGroups } from "../../Groups/hooks";
import { maskValue, unmaskValue } from "../../Form";

export interface UseContactViewArgs {
  contactId?: string;
}

export function useContactView(args: UseContactViewArgs) {

  const router = useRouter();
  const [ isSaving, setIsSaving ] = useState(false);
  const { groups, isLoading: isLoadingGroups } = useGroups();

  const { register, handleSubmit, setValue, formState: { errors }, control } = useForm<Model>({
    resolver: zodResolver(validationSchema),
    values: {
      name: '',
      email: '',
      phone: '',
      groupsId: []
    }
  });

  const onSubmit: SubmitHandler<Model> = async (data) => {

    try {
      const api = new ContactsApi();
      setIsSaving(true);

      if (args.contactId) {

        await api.update({
          contact: {
            id: args.contactId,
            name: data.name,
            phone: data.phone,
            email: data.email,
            groupsId: data.groupsId
          }
        });
      }
      else {

        await api.create({
          contact: {
            name: data.name,
            phone: data.phone,
            email: data.email,
            groupsId: data.groupsId
          }
        });
      }

      AppToast.success('Contato salvo');

      router.back();
    }
    catch(e) {

      const error = AppError.parse(e);
      AppToast.error(error.getExtendedMessage());
    }
    finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {

    if (!args.contactId)
      return;

    const contactId = args.contactId;

    const execute = async () => {

      const contact = await new ContactsApi().getById(contactId);

      setValue('name', contact.name);
      setValue('phone', contact.phone ? maskValue(contact.phone, { mask: MasksUtils.getPhoneMaskFromPlan(contact.phone) }) : '');
      setValue('email', contact.email ?? '');
      setValue('groupsId', contact.groups?.map(x => x.id));
    }

    execute();

  }, [ args.contactId ]);

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
  phone: z.string().max(15, { message: messages.invalid }).min(14, { message: messages.invalid }).transform(phone => unmaskValue(phone, { mask: MasksUtils.getPhoneMaskFromMasked(phone) })).or(z.literal('').transform(_ => undefined)),
  email: z.string().email().max(60).optional().or(z.literal('').transform(_ => undefined)),
  groupsId: z.array(z.string().min(1, { message: messages.required })).min(1)
});

type Model = z.infer<typeof validationSchema>;