import { PropsWithChildren } from "react";
import Link from "next/link";


export function AppLayoutActions({ children }: PropsWithChildren) {

  return (
    <div className="inline-flex items-center">
      {children}
    </div>
  );
}

export function AppLayoutAction({ children, href, ...props }: AppLayoutActionProps) {

  if (href) {

    return (
      <Link href={href} className="border-0 rounded-sm p-1 bg-transparent hover:bg-[#ffffff22] focus:bg-[#ffffff22]" {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className="border-0 rounded-sm p-1 bg-transparent hover:bg-[#ffffff22] focus:bg-[#ffffff22]" {...props}>
      {children}
    </button>
  );
}

export interface AppLayoutActionProps extends PropsWithChildren  {
  title?: string;
  href?: string;
}