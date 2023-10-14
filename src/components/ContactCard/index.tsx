'use client';

import { useMemo, useState } from "react";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import { EnvelopeIcon, PhoneIcon, BoltIcon, EllipsisVerticalIcon, EyeIcon } from "@heroicons/react/24/outline";
import { TimeAgo } from "@/common/datetime/time-ago";
import { AppRoutes } from "@/common/routes";
import { DropdownMenu, DropdownMenuItem, DropdownMenuToggle } from "../Form/DropdownMenu";

export default function ContactCard({ contact }: ContactItemProps) {

  const { name, phone, email, nextNotification, groups } = contact;
  const [ visible, setVisible ] = useState(false);

  const triggerAt = useMemo(() => nextNotification?.triggerAt ? new TimeAgo().format(new Date(nextNotification.triggerAt)) : null, [nextNotification?.triggerAt]);

  return (
    <div className="flex flex-row justify-between px-4 py-6 hover:bg-slate-50">
      <div className="">
        <span className="text-lg font-semibold text-slate-700">{name}</span>
        <div className="mt-2">
          {phone &&
            <span className="inline-flex flex-row items-center text-sm text-slate-500 mr-4">
              <PhoneIcon className="h-5 w-5 inline-block text-blue-600 mr-2" />
              <span>{phone}</span>
            </span>}
          {email &&
            <span className="inline-flex flex-row items-center text-sm text-slate-500 mr-4">
              <EnvelopeIcon className="h-5 w-5 inline-block text-amber-600 mr-2" />
              <span>{email}</span>
            </span>}
          {groups.map(group =>
            <span key={group.id} className="inline-flex flex-row items-center text-sm text-slate-500 mr-4">
              <div className="h-5 w-5 inline-block mr-2 rounded-full opacity-75" style={{ backgroundColor: group.color }}></div>
              <span>{group.name}</span>
            </span>)}
          {nextNotification &&
            <div className="inline-flex flex-row items-center justify-between text-sm w-full text-slate-800 bg-slate-100 p-4 rounded mt-2">
              <span><BoltIcon className="h-5 w-5 inline-block mr-2" /> {nextNotification.description}</span>
              <span className="text-slate-400 text-xs">{triggerAt}</span>
            </div>}
        </div>
      </div>
      <div className="flex items-center justify-center">
        <DropdownMenu
          visible={visible}
          toggle={<DropdownMenuToggle onClick={() => setVisible(visible => !visible)}><EllipsisVerticalIcon className="h-5 w-5"/></DropdownMenuToggle>}>
          <DropdownMenuItem>
            <Link href={AppRoutes.newContactNotification(contact.id)}><BoltIcon className="h-5 w-5 inline-block" /> Criar notificação</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span onClick={() => setVisible(() => false)}>
            <Link href={AppRoutes.contactNotificationTriggers(contact.id)}><EyeIcon className="h-5 w-5 inline-block" /> Ver notificações</Link>

            </span>
          </DropdownMenuItem>
        </DropdownMenu>
      </div>
    </div>
  );
}

ContactCard.Skeleton = function ContactCardSkeleton() {

  return (
    <div className="flex flex-col px-4 py-6 hover:bg-slate-50">
      <span className="text-lg font-semibold text-slate-700">
        <Skeleton />
      </span>
      <div className="mt-2">
        <span className="inline-flex flex-row items-center text-sm text-slate-500 mr-4">
          <PhoneIcon className="h-5 w-5 inline-block text-blue-600 mr-2" />
          <span className="w-40 inline-block"><Skeleton /></span>
        </span>
        <span className="inline-flex flex-row items-center text-sm text-slate-500 mr-4">
          <EnvelopeIcon className="h-5 w-5 inline-block text-amber-600 mr-2" />
          <span className="w-40 inline-block"><Skeleton /></span>
        </span>
        <div className="inline-flex flex-row items-center justify-between text-sm w-full text-slate-800 bg-slate-100 p-4 rounded mt-2">
          <span className="w-full"><BoltIcon className="h-5 w-5 inline-block mr-2" /> <Skeleton height={40} /></span>
        </div>
      </div>
    </div>
  );
}

export interface ContactItemProps {
  contact: Contact;
}

export interface Contact {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  nextNotification: {
    triggerAt: string;
    description: string;
  } | null;
  groups: {
    id: string;
    color: string;
    name: string;
  }[]
}
