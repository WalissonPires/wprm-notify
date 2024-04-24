import { ReactNode, useRef } from "react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button, Input } from "../../Form";
import { Modal, ModalBody, ModalHeader } from "..";


export function PromptModal({ title, message, defaultValue, btnConfirmText, btnConfirmCancel, onDone }: PromptModalProps) {

  const inputRef = useRef<HTMLInputElement>(null);
  btnConfirmText ??=  <><CheckIcon className="h-5 w-5 inline-block" /> Confirmar</>;
  btnConfirmCancel ??=  <><XMarkIcon className="h-5 w-5 inline-block" /> Cancelar</>;

  return (
    <Modal>
      <ModalHeader>{title}</ModalHeader>
      <ModalBody>
        <label className="font-bold block">{message}</label>
        <Input ref={inputRef} defaultValue={defaultValue} />
        <div className="text-center mt-3">
          <Button variant="primary" onClick={() => onDone(true, inputRef.current?.value ?? null)} className="mr-3">{btnConfirmText}</Button>
          <Button variant="secondary" onClick={() => onDone(false, null)}>{btnConfirmCancel}</Button>
        </div>
      </ModalBody>
    </Modal>
  );
}

export interface PromptModalProps {
  title: string;
  message: string;
  defaultValue?: string;
  btnConfirmText?: ReactNode;
  btnConfirmCancel?: ReactNode;
  onDone: (confirmed: boolean, value: string | null) => void | Promise<void>;
}