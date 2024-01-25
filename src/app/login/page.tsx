'use client'

import z from "zod";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { FormRow } from "@/components/Form/Row";
import { FormColumn } from "@/components/Form/Column";
import { Input } from "@/components/Form/Input";
import { Button } from "@/components/Form/Button";
import { AppLayout } from "@/components/AppLayout";
import { messages } from "@/common/validation/messages";
import { AuthApi } from "@/domains/auth/client-api";
import { useUser } from "@/domains/auth/hooks/use-user";
import { AppToast } from "@/common/ui/toast";
import { AppRoutes } from "@/common/routes";
import { FieldError } from "@/components/Form/FieldError";
import { AppError } from "@/common/error";

import logo from "../../../public/icon-192x192.png";

export default function Login() {

  const router = useRouter();
  const [ isSaving, setIsSaving ] = useState(false);
  const { setUser } = useUser({ redirect: false });

  const { register, handleSubmit, formState: { errors } } = useForm<Model>({
    resolver: zodResolver(validationSchema)
  });


  const onSubmit: SubmitHandler<Model> = async (data) => {

    try {
      const api = new AuthApi();
      setIsSaving(true);

      const user = await api.login({
        email: data.email,
        password: data.password
      });

      setUser(user);

      AppToast.success('Logado com sucesso. Redirecionado...');

      router.replace(AppRoutes.home());
    }
    catch(e) {

      const error = AppError.parse(e);
      AppToast.error(error.message);
    }
    finally {
      setIsSaving(false);
    }
  };

  return (
    <AppLayout>
      <div className="h-screen w-full flex flex-col items-center justify-center">
        <Image src={logo} alt="App Logo" className="mt-10" />
        <form onSubmit={handleSubmit(onSubmit)} className="flex-1 p-10">
          <FormRow>
            <FormColumn>
              <label>Email</label>
              <Input {...register('email')} type="email" required />
              <FieldError error={errors.email} />
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn>
              <label>Senha</label>
              <Input  {...register('password')} type="password" required />
              <FieldError error={errors.password} />
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn>
                <Button className="w-full" disabled={isSaving} type="submit">Entrar</Button>
            </FormColumn>
          </FormRow>
        </form>
      </div>
    </AppLayout>
  );
}

const validationSchema = z.object({
  email: z.string().max(100).min(1, { message: messages.required }),
  password: z.string().max(20).min(8)
});

type Model = z.infer<typeof validationSchema>;