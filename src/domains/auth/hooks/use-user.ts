'use client'

import useSWR from "swr";
import { useEffect } from "react"
import { useRouter } from "next/navigation";
import { HttpClientError } from "@/common/http/client/error";
import { AppRoutes } from "@/common/routes";
import { AuthApi } from "../client-api";

export function useUser() {

  const router = useRouter();
  const { data: user, error } = useSWR('user-logged', () => new AuthApi().getCurrentUser());

  useEffect(() => {

    if (!user) {
      router.push(AppRoutes.login());
      return;
    }

    if (error && HttpClientError.is(error) && error.statusCode === 401) {

      router.push(AppRoutes.login());
      return;
    }


  }, [ user, error ]);

  return {
    user: user ?? null
  };
}