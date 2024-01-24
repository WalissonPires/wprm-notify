'use client'

import { PropsWithChildren } from "react";
import Skeleton from "react-loading-skeleton";
import { useUser } from "@/domains/auth/hooks/use-user";


export function AppLayoutPreLoading({ children }: PropsWithChildren) {

  const { user } = useUser();

  if (!user) {
    return (
      <div className="p-2">
        <Skeleton height={100}></Skeleton>
      </div>
    );
  }

  return children;
}