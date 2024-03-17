import { ReactNode } from "react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "../../Form";
import { Modal, ModalBody, ModalHeader } from "..";


export function ConfirmModal({ title, message, btnConfirmText, btnConfirmCancel, onDone }: ConfirmModalProps) {

  btnConfirmText ??=  <><CheckIcon className="h-5 w-5 inline-block" /> Confirmar</>;
  btnConfirmCancel ??=  <><XMarkIcon className="h-5 w-5 inline-block" /> Cancelar</>;

  return (
    <Modal>
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>
        <p>{message}</p>
        <div className="text-center mt-3">
          <Button variant="primary" onClick={() => onDone(true)} className="mr-3">{btnConfirmText}</Button>
          <Button variant="secondary" onClick={() => onDone(false)}>{btnConfirmCancel}</Button>
        </div>
      </ModalBody>
    </Modal>
  );
}

export interface ConfirmModalProps {
  title: string;
  message: string;
  btnConfirmText?: ReactNode;
  btnConfirmCancel?: ReactNode;
  onDone: (confirmed: boolean) => void | Promise<void>;
}