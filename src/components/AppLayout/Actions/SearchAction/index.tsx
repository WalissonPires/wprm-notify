'use client'

import { useSnapshot } from "valtio";
import { ChangeEvent, useEffect, useRef } from "react";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Input } from "@/components/Form";
import { searchActionState } from "./state";
import { AppLayoutAction } from "..";


export function SearchAction({ placeholder }: SearchActionProps) {

  const { enabled, value } = useSnapshot(searchActionState);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {

    searchActionState.value = event.target.value;
  };

  const show = () => searchActionState.enabled = true;
  const hide = () => {
    searchActionState.enabled = false;
    searchActionState.value = '';
  }

  useEffect(() => {

    if (!enabled || !inputRef.current)
      return;

    inputRef.current.focus();

  },  [ enabled ]);

  return (
    <div className="flex flex-row justify-end w-full">
      {enabled && <Input value={value} onChange={handleChange} ref={inputRef} placeholder={placeholder ?? 'Pesquisar...'} className="text-white placeholder:text-white/50 flex-1 max-w-sm" />}
      {enabled && <AppLayoutAction onClick={hide}><XMarkIcon className="h-5 w-5" /></AppLayoutAction>}
      {!enabled && <AppLayoutAction onClick={show}><MagnifyingGlassIcon className="h-5 w-5" /></AppLayoutAction>}
    </div>
  );
}

export interface SearchActionProps {
  placeholder?: string;
}