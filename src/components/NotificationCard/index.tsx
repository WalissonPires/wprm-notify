'use client';

import { useMemo } from "react";
import { DateTime } from "luxon";
import Skeleton from "react-loading-skeleton";
import { Notification1 } from "@/domains/notifications/use-cases/entities";

export default function NotificationCard({ notification }: NotificationCardProps) {

  const { sendedAt, content } = notification;

  const sendedAtFormatted = useMemo(() => sendedAt ? DateTime.fromISO(sendedAt).setLocale("pt").toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY) : null, [ sendedAt ]);

  return (
    <div className="flex flex-col px-4 py-6 hover:bg-slate-50">
      <small className="block text-slate-500 mb-3">{sendedAtFormatted}</small>
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
}
