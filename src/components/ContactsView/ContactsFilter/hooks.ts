import { useSnapshot } from "valtio";
import { contactsFilterState, searchActionState } from "./state";
import { useRef } from "react";

export function useContactsFilter() {

  const { filters } = useSnapshot(contactsFilterState);

  return {
    filters: {
      groups: filters.groups ? Array.from(filters.groups) : undefined
    }
  };
}


export function useContactsSeachInput({ onChange }: UseSeachActionArgs) {

  const { enabled, value } = useSnapshot(searchActionState);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  if (timeoutIdRef.current)
    clearTimeout(timeoutIdRef.current);

  const lastEnabledRef = useRef(false);
  const lastEnabled = lastEnabledRef.current;
  lastEnabledRef.current = enabled;

  if (lastEnabled != enabled)
    return;

  timeoutIdRef.current = setTimeout(() => {

    onChange(value);

  }, 400);
}

export interface UseSeachActionArgs {
onChange: (value: string) => void;
}