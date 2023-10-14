'use client'

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export function AppLayoutBackWithTitle({ title }: AppLayoutBackWithTitleProps) {

  const router = useRouter();
  const handleBackClick = () => router.back();

  return (
    <div className="inline-flex items-center">
      <span  onClick={handleBackClick}><ArrowLeftIcon className="h-5 w-5 mr-4 cursor-pointer hover:scale-110" title="Menu" /></span>
      <h1 className="text-base inline-block">{title}</h1>
    </div>
  );
}


export interface AppLayoutBackWithTitleProps {
  title: string;
}