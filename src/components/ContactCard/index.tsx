'use client';

import { MouseEvent, useMemo } from "react";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import { EnvelopeIcon, PhoneIcon, BoltIcon, EllipsisVerticalIcon, EyeIcon, TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { TimeAgo } from "@/common/datetime/time-ago";
import { Masks, MasksUtils } from "@/common/validation/masks";
import { AppRoutes } from "@/common/routes";
import { DropdownMenu, DropdownMenuItem, DropdownMenuToggle, maskValue } from "../Form";
import { useDrodownMenu } from "../Form/DropdownMenu/hooks";

export default function ContactCard({ contact, onEditContact, onDeleteContact }: ContactItemProps) {

  const { name, phone, email, nextNotification, groups } = contact;
  const { visible, setVisible } = useDrodownMenu(ContactCard.name);

  const triggerAgo = useMemo(() => nextNotification?.triggerAt ? new TimeAgo().format(new Date(nextNotification.triggerAt)) : null, [nextNotification?.triggerAt]);
  const triggerAt = useMemo(() => nextNotification?.triggerAt ? new Date(nextNotification.triggerAt).toLocaleDateString() : null, [nextNotification?.triggerAt]);

  const handleToggleDropdown = (event: MouseEvent) => {

    event.stopPropagation();
    event.preventDefault();
    setVisible(!visible);
  };

  const handleDropdownItemClick = (event: MouseEvent) => {

    event.stopPropagation();
    event.preventDefault();
    setVisible(false);
  };

  const handleEditContact = (event: MouseEvent) => {

    handleDropdownItemClick(event);
    onEditContact();
  };

  const handleDeleteContact = (event: MouseEvent) => {

    handleDropdownItemClick(event);
    onDeleteContact();
  };

  return (
    <div className="flex flex-row justify-between px-4 py-6 hover:bg-slate-50">
      <div className="flex-1">
        <span className="text-lg font-semibold text-slate-700">{name}</span>
        <div className="mt-2">
          {phone &&
            <span className="inline-flex flex-row items-center text-sm text-slate-500 mr-4">
              <PhoneIcon className="h-5 w-5 inline-block text-blue-600 mr-2" />
              <span>{maskValue(phone, { mask: MasksUtils.getPhoneMaskFromPlan(phone) })}</span>
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
              <span className="text-slate-400 text-xs" title={triggerAt ?? undefined}>{triggerAgo}</span>
            </div>}
        </div>
      </div>
      <div className="flex items-center justify-center ml-3">
        <DropdownMenu
          visible={visible}
          toggle={<DropdownMenuToggle onClick={handleToggleDropdown}><EllipsisVerticalIcon className="h-5 w-5"/></DropdownMenuToggle>}>
          <DropdownMenuItem onClick={handleEditContact}>
            <span><PencilSquareIcon className="h-5 w-5 inline-block" /> Editar</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDropdownItemClick}>
            <Link href={AppRoutes.newContactNotification(contact.id)}><BoltIcon className="h-5 w-5 inline-block" /> Criar notificação</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDropdownItemClick}>
              <Link href={AppRoutes.contactNotificationTriggers(contact.id)}><EyeIcon className="h-5 w-5 inline-block" /> Ver notificações</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDeleteContact}>
              <span><TrashIcon className="h-5 w-5 inline-block" /> Excluir</span>
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
  onDeleteContact: () => void | Promise<void>;
  onEditContact: () => void | Promise<void>;
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
