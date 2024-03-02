import { ButtonHTMLAttributes, PropsWithChildren } from "react";
import Link from "next/link";


export function AppLayoutActions({ children }: PropsWithChildren) {

  return (
    <div className="inline-flex items-center justify-end flex-1 ml-3">
      {children}
    </div>
  );
}

export function AppLayoutAction({ children, href, onClick, ...props }: AppLayoutActionProps) {

  if (href) {

    if (onClick)
      throw new Error('OnClick cannot be used with href');

    return (
      <Link href={href} className="border-0 rounded-sm p-1 mx-2 bg-transparent hover:bg-[#ffffff22] focus:bg-[#ffffff22]" {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} type="button" className="border-0 rounded-sm p-1 bg-transparent hover:bg-[#ffffff22] focus:bg-[#ffffff22]" {...props}>
      {children}
    </button>
  );
}

export interface AppLayoutActionProps extends PropsWithChildren  {
  title?: string;
  href?: string;
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>['onClick'];
}