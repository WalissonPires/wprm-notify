'use client';

import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import { EllipsisVerticalIcon, PencilIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { DropdownMenu, DropdownMenuItem, DropdownMenuToggle } from "../Form";
import { useDrodownMenu } from "../Form/DropdownMenu/hooks";
import { MessageTemplate1 } from "@/domains/message-templates/entities";

export default function MessageTemplateCard({ messageTemplate, onDeleteClick }: MessageTemplateCardProps) {

  const { name, content } = messageTemplate;
  const { visible, setVisible } = useDrodownMenu(MessageTemplateCard.name);

  return (
    <div className="flex flex-row justify-between px-4 py-6 hover:bg-slate-50">
      <div className="flex-1">
        <span className="text-lg font-semibold text-slate-700">{name}</span>
        <div className="text-sm w-full text-slate-800 bg-slate-100 p-4 rounded mt-2">
          {content}
        </div>
      </div>
      <div className="flex items-center justify-center ml-3">
        <DropdownMenu
          visible={visible}
          toggle={<DropdownMenuToggle onClick={() => setVisible(!visible)}><EllipsisVerticalIcon className="h-5 w-5"/></DropdownMenuToggle>}>
          <DropdownMenuItem onClick={onDeleteClick}>
              <Link href="#"><XMarkIcon className="h-5 w-5 inline-block" /> Excluir</Link>
          </DropdownMenuItem>
        </DropdownMenu>
      </div>
    </div>
  );
}

MessageTemplateCard.Skeleton = function ContactCardSkeleton() {

  return (
    <div className="flex flex-col px-4 py-6 hover:bg-slate-50">
      <span className="text-lg font-semibold text-slate-700">
        <Skeleton />
      </span>
      <div className="text-sm w-full text-slate-800 bg-slate-100 p-4 rounded mt-2">
        <Skeleton height={40} />
      </div>
    </div>
  );
}

export interface MessageTemplateCardProps {
  messageTemplate: MessageTemplate1;
  onDeleteClick: () => void;
}