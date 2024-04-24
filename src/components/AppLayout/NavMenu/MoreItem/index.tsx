'use client'

import Link from "next/link";
import { ArrowUpOnSquareIcon, CogIcon, EllipsisHorizontalIcon, UserGroupIcon, ArrowRightOnRectangleIcon, ChatBubbleOvalLeftEllipsisIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useUser } from "@/domains/auth/hooks/use-user";
import { Modal, ModalHeader, ModalPosition } from "@/components/Modal";
import { AppRoutes } from "@/common/routes";
import { Button } from "@/components/Form";
import { useMoreItem } from "./hook";

export function MoreItem() {

  const { visible, handleShow, handleHide, handleLogout } = useMoreItem();
  const { user } = useUser();

  return (
  <>
    <a onClick={handleShow} href="#" className="flex flex-col items-center"><EllipsisHorizontalIcon className="h-5 w-5" /> Mais</a>
    { visible &&
    <Modal position={ModalPosition.bottomCenter}>
      <ModalHeader onRequestClose={handleHide}>
          {user && <span className="flex items-center text-lg v text-green-600"><UserCircleIcon className="h-7 w-7 inline-block mr-2" /> {user.name}</span>}
      </ModalHeader>
      <div>
        <Button onClick={handleHide} variant="textOnly" className="text-left w-full border-b py-4">
          <Link href={AppRoutes.chatbotFlow()} className="block"><ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5 inline-block" /> Chatbot</Link>
        </Button>
        <Button onClick={handleHide} variant="textOnly" className="text-left w-full border-b py-4">
          <Link href={AppRoutes.groups()} className="block"><UserGroupIcon className="h-5 w-5 inline-block" /> Grupos</Link>
        </Button>
        <Button onClick={handleHide} variant="textOnly" className="text-left w-full border-b py-4">
          <Link href={AppRoutes.settings()} className="block"><CogIcon className="h-5 w-5 inline-block" /> Configurações</Link>
        </Button>
        <Button onClick={handleHide} variant="textOnly" className="text-left w-full border-b py-4">
          <Link href={AppRoutes.importContacts()} className="block"><ArrowUpOnSquareIcon className="h-5 w-5 inline-block" /> Importar contatos</Link>
        </Button>
        <Button onClick={handleLogout} variant="textOnly" className="text-left w-full border-b py-4">
          <span className="block"><ArrowRightOnRectangleIcon className="h-5 w-5 inline-block" /> Sair</span>
        </Button>

      </div>
    </Modal> }
  </>);
}