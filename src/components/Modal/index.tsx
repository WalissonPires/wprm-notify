import { PropsWithChildren } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "../Form";

export function Modal({ position, children }: ModalProps) {

  const classesPosition = getPositionClasses(position ?? ModalPosition.topCenter);

  return (
  <div className={`fixed top-0 left-0 pt-14 h-full w-full flex z-20 bg-black/10 ${classesPosition}`}>
    <div className="bg-white rounded flex flex-col shadow w-full m-4 sm:min-w-[400px] sm:w-fit">
      {children}
    </div>
  </div>);
}

export interface ModalProps extends PropsWithChildren {
  position?: ModalPosition;
}

export enum ModalPosition {
  topCenter = 1,
  bottomCenter =2
}

function getPositionClasses(position: ModalPosition) {

  const classes: Record<ModalPosition, string> = {
    [ModalPosition.topCenter]: 'items-start justify-center',
    [ModalPosition.bottomCenter]: 'items-end justify-center pb-20'
  };

  return classes[position];
}




export function ModalHeader({ children, onRequestClose }: ModalHeaderProps) {

  return (
    <div className="p-3 border-b flex flex-row justify-between items-center">
      {children}
      {onRequestClose && <Button onClick={onRequestClose} variant="textOnly"><XMarkIcon className="h-5 w-5" /></Button>}
    </div>
  );
}

export interface ModalHeaderProps extends PropsWithChildren {
  onRequestClose?: () => void;
}


export function ModalBody({ children }: PropsWithChildren) {

  return (
    <div className="p-3 flex-1">
      {children}
    </div>
  );
}