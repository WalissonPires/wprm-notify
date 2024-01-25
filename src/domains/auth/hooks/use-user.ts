'use client'

import { proxy, useSnapshot } from "valtio";
import { useEffect } from "react"
import { useRouter } from "next/navigation";
import { UserLogged } from "@/common/auth/user";
import { HttpClientError } from "@/common/http/client/error";
import { AppRoutes } from "@/common/routes";
import { AppToast } from "@/common/ui/toast";
import { AppError } from "@/common/error";
import { AuthApi } from "../client-api";

const userState = proxy<UserState>({
  user: null,
  checked: false
});

interface UserState {
  user: UserLogged | null;
  checked: boolean;
}


export function useUser() {

  const router = useRouter();
  const { user, checked } = useSnapshot(userState);

  useEffect(() => {

    if (checked) return;

    userState.checked = true;

    (async () => {

      try {
        const user = await new AuthApi().getCurrentUser();

        if (!user) {
          router.push(AppRoutes.login());
          return;
        }

        userState.user = user;
      }
      catch(error) {

        if (error && HttpClientError.is(error) && error.statusCode === 401) {

          router.push(AppRoutes.login());
          return;
        }

        userState.user = null;
        AppToast.error(AppError.parse(error).message);
      }

    })();

  }, []);


  return {
    user
  };
}