'use client'

import useSWR from "swr";
import { useEffect } from "react"
import { useRouter } from "next/navigation";
import { HttpClientError } from "@/common/http/client/error";
import { AppRoutes } from "@/common/routes";
import { AppError } from "@/common/error";
import { AuthApi } from "../client-api";
import { GetCurrentUserResult } from "../use-cases/get-current-user-types";

export function useUser(args?: UseUserArgs) {

  const router = useRouter();
  const { data: user, error, isLoading, mutate } = useSWR('user-logged', () => new AuthApi().getCurrentUser());

  const redirect = args?.redirect !== false;

  console.log({
    isLoading,
    user,
    error
  });

  useEffect(() => {

    if (isLoading)
      return;

    if (!redirect)
      return;

    if (error) {

      if (HttpClientError.is(error) && error.statusCode === 401) {
        router.push(AppRoutes.login());
        return;
      }
    }

    if (!user) {
      router.push(AppRoutes.login());
      return;
    }

  }, [ isLoading, user, error, redirect ]);

  return {
    user: user ?? null,
    error: error ? AppError.parse(error) : null,
    setUser: (user: GetCurrentUserResult | null) => mutate(user)
  };
}

export interface UseUserArgs {
  redirect?: boolean;
}