'use client'

import { PropsWithChildren } from "react";
import Skeleton from "react-loading-skeleton";
import { useUser } from "@/domains/auth/hooks/use-user";


export function AppLayoutPreLoading({ children }: PropsWithChildren) {

  const { user, error } = useUser();

  if (error) {
    return (<div className="bg-red-300 text-white p-2">{error.message}</div>);
  }

  if (!user) {
    return (
      <div className="p-2">
        <Skeleton height={100}></Skeleton>
      </div>
    );
  }

  return children;
}