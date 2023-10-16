import Link from "next/link";
import { PropsWithChildren } from "react";
import { BoltIcon, EnvelopeIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { AppRoutes } from "@/common/routes";

export function AppNavMenu({ children }: PropsWithChildren) {

  return (
    <ul className="flex flex-row justify-center bg-white border">
      {children}
    </ul>
  );
}

export function AppNavMenuItem({ active, children }: AppNavMenuItemProps) {

  const activeClass = active ? 'border-t-4 border-green-500' : '';

  return (
    <li className={`inline-flex flex-col items-center p-3 hover:bg-slate-100 focus:bg-slate-100 text-sm ${activeClass}`}>
      {children}
    </li>
  );
}

export interface AppNavMenuItemProps extends PropsWithChildren {
  active?: boolean;
}


export function AppNavMenuDefault({ active }: AppNavMenuDefaultProps) {

  return (
    <AppNavMenu>
      <AppNavMenuItem active={active === AppNavMenuItens.contacts}>
        <UserGroupIcon className="h-5 w-5" />
        <Link href={AppRoutes.home()}>Contatos</Link>
      </AppNavMenuItem>
      <AppNavMenuItem active={active === AppNavMenuItens.notifications}>
        <BoltIcon className="h-5 w-5" />
        <Link href={AppRoutes.notifications()}>Notificações</Link>
      </AppNavMenuItem>
      <AppNavMenuItem active={active === AppNavMenuItens.messageTemplates}>
        <EnvelopeIcon className="h-5 w-5" />
        <Link href={AppRoutes.messageTemplates()}>Mensagens</Link>
      </AppNavMenuItem>
    </AppNavMenu>
  );
}

export interface AppNavMenuDefaultProps {
  active: AppNavMenuItens;
}

export enum AppNavMenuItens {
  contacts = 1,
  notifications = 2,
  messageTemplates = 3
}