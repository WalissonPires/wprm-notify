'use client'

import useSWR from "swr";
import { useEffect } from "react"
import { useRouter } from "next/navigation";
import { HttpClientError } from "@/common/http/client/error";
import { UserLogged } from "@/common/auth/user";
import { AppRoutes } from "@/common/routes";
import { AuthApi } from "../client-api";

export function useUser(args?: UseUserArgs) {

  const router = useRouter();
  const { data: user, error, mutate } = useSWR('user-logged', () => new AuthApi().getCurrentUser());

  const redirect = args?.redirect !== false;

  useEffect(() => {

    if (!redirect)
      return;

    if (!user) {
      router.push(AppRoutes.login());
      return;
    }

    if (error && HttpClientError.is(error) && error.statusCode === 401) {

      router.push(AppRoutes.login());
      return;
    }


  }, [ user, error, redirect ]);

  return {
    user: user ?? null,
    setUser: (user: UserLogged | null) => mutate(user)
  };
}

export interface UseUserArgs {
  redirect?: boolean;
}