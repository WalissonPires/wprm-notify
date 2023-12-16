import { PropsWithChildren } from "react";


export function FormColumn({ children, size }: FormColumnProps) {

  return (
    <div className={`${size} px-3 mb-6 md:mb-0`}>{children}</div>
  );
}

export enum ColSize {
  full = 'w-full',
  s1s2 = 'w-1/2',
  s2s2 = 'w-2/2',
  s1s4 = 'w-1/4',
  s2s4 = 'w-2/4',
  s3s4 = 'w-4/4',
  s4s4 = 'w-4/4',
};

export interface FormColumnProps extends PropsWithChildren {
  size?: ColSize;
}