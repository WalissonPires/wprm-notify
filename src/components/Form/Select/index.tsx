'use client'

import { forwardRef } from "react";

export const Select = forwardRef<HTMLSelectElement>(function Select ({ children, ...props }: React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>, ref) {

  return (
  <select className="appearance-none bg-transparent w-full border-b border-teal-400 hover:border-teal-500 text-gray-700 py-1 px-2 leading-tight focus:outline-none" ref={ref} {...props}>
    {children}
  </select>);
});