'use client';

import { useMemo } from "react";
import { DateTime } from "luxon";
import Skeleton from "react-loading-skeleton";
import { CheckIcon, ClockIcon, EllipsisVerticalIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Notification1 } from "@/domains/notifications/use-cases/entities";
import { DropdownMenu, DropdownMenuItem, DropdownMenuToggle } from "../Form";
import { useDrodownMenu } from "../Form/DropdownMenu/hooks";

export default function NotificationCard({ notification, showContact, onCancelClick }: NotificationCardProps) {

  const { sendedAt, scheduledAt, canceledAt, content, contact } = notification;
  const { visible, setVisible } = useDrodownMenu(NotificationCard.name);

  const sendedAtFormatted = useMemo(() => sendedAt ? DateTime.fromISO(sendedAt).setLocale("pt").toLocaleString(DateTime.DATETIME_SHORT) : null, [ sendedAt ]);
  const scheduledAtFormatted = useMemo(() => scheduledAt ? DateTime.fromISO(scheduledAt).setLocale("pt").toLocaleString(DateTime.DATETIME_SHORT) : null, [ scheduledAt ]);
  const canceledAtFormatted = useMemo(() => canceledAt ? DateTime.fromISO(canceledAt).setLocale("pt").toLocaleString(DateTime.DATETIME_SHORT) : null, [ canceledAt ]);

  const allowCancel = !canceledAt && !sendedAt;
  const hasActions = allowCancel;

  const handleCancel = () => {

    setVisible(false);
    onCancelClick?.();
  };

  return (
    <div className="flex flex-row justify-between px-4 py-6 hover:bg-slate-50">
      <div className="flex flex-col flex-1">
        <div className="flex flex-row justify-between flex-wrap items-center mb-3">
          {showContact && <small className="text-current font-bold">{contact?.name ?? ''}</small>}
          {sendedAtFormatted && <small className="block text-slate-500"><CheckIcon className="h-5 w-5 text-green-600 inline-block" /> {sendedAtFormatted}</small>}
          {!sendedAtFormatted && !canceledAtFormatted && scheduledAtFormatted && <small className="block text-slate-500"><ClockIcon className="h-5 w-5 text-yellow-600 inline-block" /> {scheduledAtFormatted}</small>}
          {canceledAtFormatted && <small className="block text-slate-500"><XMarkIcon className="h-5 w-5 text-red-600 inline-block" /> {scheduledAtFormatted}</small>}
        </div>
        <span className="block text-slate-700">{content}</span>
      </div>
      <div className="flex items-center justify-center ml-3">
        {onCancelClick &&
        <DropdownMenu
          visible={visible}
          toggle={<DropdownMenuToggle onClick={() => setVisible(!visible)}><EllipsisVerticalIcon className="h-5 w-5"/></DropdownMenuToggle>}>
          {allowCancel && <DropdownMenuItem onClick={handleCancel}>
            <span><XMarkIcon className="h-5 w-5 inline-block" /> Cancelar envio</span>
          </DropdownMenuItem>}
          {!hasActions && <DropdownMenuItem>Nenhum ação</DropdownMenuItem>}
        </DropdownMenu>}
      </div>
    </div>
  );
}

NotificationCard.Skeleton = function NotificationTriggerCardSkeleton() {

  return (
    <div className="flex flex-col px-4 py-6 hover:bg-slate-50">
      <small className="block text-slate-500 mb-3">
        <Skeleton className="w-10" />
      </small>
      <span className="block text-lg font-semibold text-slate-700">
        <Skeleton height="2rem" />
      </span>
    </div>
  );
}

export interface NotificationCardProps {
  notification: Notification1;
  showContact?: boolean;
  onCancelClick?: () => void;
}
