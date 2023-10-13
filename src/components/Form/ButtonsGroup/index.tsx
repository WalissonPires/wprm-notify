'use client'

import { PropsWithChildren } from "react";

export function ButtonsGroup({ children }: PropsWithChildren) {

  return (
    <div className="inline-flex text-sm mr-4">{children}</div>
  );
}

export function ButtonItem({ active, onClick, children }: ButtonItemProps) {

  return (
    <button onClick={() => onClick()} className={`${active ? 'bg-gray-400' : 'bg-gray-300'} hover:bg-gray-500 text-gray-800 py-2 px-4 first:rounded-l last:rounded-r`} type="button">
      {children}
    </button>);
}

export interface ButtonItemProps extends PropsWithChildren {
  active?: boolean;
  onClick: () => void;
}