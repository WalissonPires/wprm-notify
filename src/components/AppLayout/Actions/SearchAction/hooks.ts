import { useRef } from "react";
import { useSnapshot } from "valtio";
import { searchActionState } from "./state";


export function useSeachAction({ onChange }: UseSeachActionArgs) {

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