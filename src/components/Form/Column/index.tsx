import { PropsWithChildren } from "react";


export function FormColumn({ children, portion, amount }: FormColumnProps) {

  const widthClass = portion === 1 && amount === 1 ? 'w-full' : `w-${portion}/${amount}`;

  return (
    <div className={`${widthClass} px-3 mb-6 md:mb-0`}>{children}</div>
  );
}

export interface FormColumnProps extends PropsWithChildren {
  /***
   * Quantity portion, starting at 1
  */
  portion: number;
  amount: number;
}