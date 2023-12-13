import { ReactNode } from "react";
import Image from "next/image";

export function AppLayoutMenuWithTitle({ title }: AppLayoutMenuWithTitleProps) {

  return (
    <div className="flex items-center">
      <Image src="/favicon-light-32x32.png" alt="Logo" height="25" width="25" className="mr-2" />
      <h1 className="text-base inline-block">{title ?? 'Wprm Notify'}</h1>
    </div>
  );
}

export interface AppLayoutMenuWithTitleProps {
  title?: ReactNode;
}
