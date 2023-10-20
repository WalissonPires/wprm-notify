'use client'

import { forwardRef } from "react";

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea({ className, ...props }, ref) {

  return <textarea ref={ref} className={`appearance-none bg-transparent w-full border-b border-teal-400 hover:border-teal-500 text-gray-700 py-1 px-2 leading-tight focus:outline-none ${className ?? ''}`} {...props}></textarea>;
});

export interface TextAreaProps extends React.DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {

}