import Link from "next/link";
import { PropsWithChildren } from "react";
import { BoltIcon, EnvelopeIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { AppRoutes } from "@/common/routes";
import { MoreItem } from "./MoreItem";

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
        <Link href={AppRoutes.home()} className="flex flex-col items-center"><UserGroupIcon className="h-5 w-5" /> Contatos</Link>
      </AppNavMenuItem>
      <AppNavMenuItem active={active === AppNavMenuItens.notifications}>
        <Link href={AppRoutes.notifications()} className="flex flex-col items-center"><BoltIcon className="h-5 w-5" /> Notificações</Link>
      </AppNavMenuItem>
      <AppNavMenuItem active={active === AppNavMenuItens.messageTemplates}>
        <Link href={AppRoutes.messageTemplates()} className="flex flex-col items-center"><EnvelopeIcon className="h-5 w-5" /> Mensagens</Link>
      </AppNavMenuItem>
      <AppNavMenuItem  active={active === AppNavMenuItens.more}>
        <MoreItem />
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
  messageTemplates = 3,
  settings = 4,
  more = 5
}