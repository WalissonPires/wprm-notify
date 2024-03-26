'use client';

import Link from "next/link";
import { MouseEvent } from "react";
import Skeleton from "react-loading-skeleton";
import { EllipsisVerticalIcon, PencilSquareIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Group } from "@/domains/groups/entities";
import { DropdownMenu, DropdownMenuItem, DropdownMenuToggle } from "../Form";
import { useDrodownMenu } from "../Form/DropdownMenu/hooks";

export default function GroupCard({ group, onEditClick, onDeleteClick }: MessageTemplateCardProps) {

  const { name, color } = group;
  const { visible, setVisible } = useDrodownMenu(GroupCard.name);

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

  const handleEditClick = (event: MouseEvent) => {

    handleDropdownItemClick(event);
    onEditClick();
  }

  const handleDeleteClick = (event: MouseEvent) => {

    handleDropdownItemClick(event);
    onDeleteClick();
  };

  return (
    <div className="flex flex-row justify-between px-4 py-6 hover:bg-slate-50">
      <div className="flex-1 flex items-center">
        <div className="h-7 w-7 inline-block mr-2 rounded-full opacity-75" style={{ backgroundColor: group.color }}></div>
        <span className="text-lg font-semibold text-slate-700">{name}</span>
      </div>
      <div className="flex items-center justify-center ml-3">
        <DropdownMenu
          visible={visible}
          toggle={<DropdownMenuToggle onClick={handleToggleDropdown}><EllipsisVerticalIcon className="h-5 w-5"/></DropdownMenuToggle>}>
          <DropdownMenuItem onClick={handleEditClick}>
            <Link href="#"><PencilSquareIcon className="h-5 w-5 inline-block" /> Editar</Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDeleteClick}>
            <Link href="#"><XMarkIcon className="h-5 w-5 inline-block" /> Excluir</Link>
          </DropdownMenuItem>
        </DropdownMenu>
      </div>
    </div>
  );
}

GroupCard.Skeleton = function ContactCardSkeleton() {

  return (
    <div className="flex flex-row px-4 py-6 hover:bg-slate-50">
      <div>
        <Skeleton circle height={30} width={30} className="inline-block" />
      </div>
      <div className="flex-1 ml-3">
        <Skeleton height={30} className="inline-block" />
        </div>
    </div>
  );
}

export interface MessageTemplateCardProps {
  group: Group;
  onDeleteClick: () => void;
  onEditClick: () => void | Promise<void>;
}