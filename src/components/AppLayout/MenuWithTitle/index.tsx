'use client'

import { Bars3Icon } from "@heroicons/react/24/outline";

export function AppLayoutMenuWithTitle({ }: AppLayoutMenuWithTitleProps) {

  return (
    <div className="flex items-center">
      <span onClick={() => alert('clicked')}><Bars3Icon className="h-5 w-5 mr-4 cursor-pointer hover:scale-110" title="Menu" /></span>
      <h1 className="text-base inline-block">Wprm Notify</h1>
    </div>
  );
}

export interface AppLayoutMenuWithTitleProps {

}