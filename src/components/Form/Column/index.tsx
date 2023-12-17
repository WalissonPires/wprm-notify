import { PropsWithChildren } from "react";


export function FormColumn({ children, size }: FormColumnProps) {

  return (
    <div className={`col-span-4 px-3 mb-6 md:mb-0 md:${size}`}>{children}</div>
  );
}

export enum ColSize {
  full = 'col-span-4',
  span1 = 'col-span-1',
  span2 = 'col-span-2',
  span3 = 'col-span-3',
  span4 = 'col-span-4',
};

export interface FormColumnProps extends PropsWithChildren {
  size?: ColSize;
}