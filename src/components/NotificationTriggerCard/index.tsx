'use client';

import { Info } from "luxon";
import { useMemo } from "react";
import Skeleton from "react-loading-skeleton";
import { EllipsisVerticalIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Trigger1, TriggerType, TriggerTypeDisplay } from "@/domains/notification-triggers/entities";
import { DropdownMenu, DropdownMenuItem, DropdownMenuToggle } from "../Form";
import { useDrodownMenu } from "../Form/DropdownMenu/hooks";

export default function NotificationTriggerCard({ trigger, onDeleteClick }: NotificationTriggerCardProps) {

  const { templateMessage, type, day, month } = trigger;

  const { visible, setVisible } = useDrodownMenu(NotificationTriggerCard.name);

  const triggerAt = useMemo(() => {

    const map = {
      [TriggerType.Daily]: () => '',
      [TriggerType.Monthy]: () => 'Todo dia ' + (day?.toString().padStart(2, '0') ?? '-') + ' de cada mês',
      [TriggerType.Yearly]: () => 'Todo dia ' + (day?.toString().padStart(2, '0') ?? '-') + ' de ' + Info.months('long')[(month ?? 0) - 1],
    };

    return map[type]();

  }, [ day, month, type ]);

  return (
    <div className="flex flex-row justify-between px-4 py-6 hover:bg-slate-50">
      <div className="flex-1">
        <span className="text-lg font-semibold text-slate-700">{templateMessage?.name ?? '--'}</span>
        <div className="mt-2">
          <div className="inline-flex flex-row items-center justify-between text-sm w-full text-slate-800 bg-slate-100 p-4 rounded mt-2">
            <span>{TriggerTypeDisplay[type]}</span><span>{triggerAt}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center ml-3">
        <DropdownMenu
          visible={visible}
          toggle={<DropdownMenuToggle onClick={() => setVisible(!visible)}><EllipsisVerticalIcon className="h-5 w-5"/></DropdownMenuToggle>}>
          <DropdownMenuItem onClick={onDeleteClick}>
            <span><XMarkIcon className="h-5 w-5 inline-block" /> Excluir</span>
          </DropdownMenuItem>
        </DropdownMenu>
      </div>
    </div>
  );
}

NotificationTriggerCard.Skeleton = function NotificationTriggerCardSkeleton() {

  return (
    <div className="flex flex-row justify-between px-4 py-6 hover:bg-slate-50">
      <div className="flex-1">
        <span className="text-lg font-semibold text-slate-700">
          <Skeleton />
        </span>
        <div className="mt-2">
          <div className="inline-flex flex-row items-center justify-between text-sm w-full text-slate-800 bg-slate-100 p-4 rounded mt-2">
            <Skeleton />
          </div>
        </div>
      </div>
    </div>
  );
}

export interface NotificationTriggerCardProps {
  trigger: Trigger1;
  onDeleteClick: () => void;
}
