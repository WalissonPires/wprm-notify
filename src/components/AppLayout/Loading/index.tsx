'use client'

import { useLoading } from "./hooks";

export function AppLoading() {

  const { isLoading } = useLoading();

  return (
    <>
      <div hidden={!isLoading} className="w-full h-2 absolute">
        <div className="h-full w-1/3 bg-green-500 animate-loading-slade"></div>
      </div>
      <div hidden={!isLoading} className="w-full h-full fixed top-0 left-0 z-50"></div>
    </>
  );
}