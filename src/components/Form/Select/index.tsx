'use client'

import { forwardRef } from "react";

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select ({ children, ...props }, ref) {

  return (
  <select className="appearance-none bg-transparent w-full border-b border-teal-400 hover:border-teal-500 text-gray-700 py-1 px-2 leading-tight focus:outline-none" ref={ref} {...props}>
    {children}
  </select>);
});

export interface SelectProps extends Omit<React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>, 'ref'> {

}