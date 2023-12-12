'use client'

import { useState } from "react";
import Link from "next/link";
import { CogIcon, EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { Modal, ModalHeader, ModalPosition } from "@/components/Modal";
import { AppRoutes } from "@/common/routes";
import { Button } from "@/components/Form";

export function MoreItem() {

  const [ visible, setVisible ] = useState(false);

  const handleShow = () => setVisible(true);
  const handleHide = () => setVisible(false);

  return (
  <>
    <Button onClick={handleShow} variant="textOnly" className="flex flex-col items-center"><EllipsisHorizontalIcon className="h-5 w-5" /> Mais</Button>
    { visible &&
    <Modal position={ModalPosition.bottomCenter}>
      <ModalHeader onRequestClose={handleHide}>Mais opções</ModalHeader>
      <div>
        <Button onClick={handleHide} variant="textOnly" className="text-left w-full border-b py-4">
          <Link href={AppRoutes.settings()} className="block"><CogIcon className="h-5 w-5 inline-block" /> Configurações</Link>
        </Button>
      </div>
    </Modal> }
  </>);
}