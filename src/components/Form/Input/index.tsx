'use client'

import { forwardRef } from "react";

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input({ className, ...props }, ref) {

  return <input ref={ref} className={`appearance-none bg-transparent w-full border-b border-teal-400 hover:border-teal-500 text-gray-700 py-1 px-2 leading-tight focus:outline-none ${className ?? ''}`} {...props} />;
});

export interface InputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {

}