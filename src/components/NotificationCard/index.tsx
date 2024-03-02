'use client';

import { useMemo } from "react";
import { DateTime } from "luxon";
import Skeleton from "react-loading-skeleton";
import { Notification1 } from "@/domains/notifications/use-cases/entities";
import { CheckIcon, ClockIcon } from "@heroicons/react/24/outline";

export default function NotificationCard({ notification, showContact }: NotificationCardProps) {

  const { sendedAt, scheduledAt, content, contact } = notification;

  const sendedAtFormatted = useMemo(() => sendedAt ? DateTime.fromISO(sendedAt).setLocale("pt").toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY) : null, [ sendedAt ]);
  const scheduledAtFormatted = useMemo(() => scheduledAt ? DateTime.fromISO(scheduledAt).setLocale("pt").toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY) : null, [ scheduledAt ]);

  return (
    <div className="flex flex-col px-4 py-6 hover:bg-slate-50">
      <div className="flex flex-row justify-between items-center mb-3">
        {showContact && <small className="text-current">{contact?.name ?? ''}</small>}
        {sendedAtFormatted && <small className="block text-slate-500"><CheckIcon className="h-5 w-5 text-green-600 inline-block" /> Enviada em {sendedAtFormatted}</small>}
        {!sendedAtFormatted && scheduledAtFormatted && <small className="block text-slate-500"><ClockIcon className="h-5 w-5 text-yellow-600 inline-block" /> Agendada para {scheduledAtFormatted}</small>}
      </div>
      <span className="block text-lg font-semibold text-slate-700">{content}</span>
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
}
