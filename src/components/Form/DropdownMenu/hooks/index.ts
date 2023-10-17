import { useMemo } from "react";
import { useSnapshot } from "valtio";
import { nanoid } from "nanoid/non-secure";
import { dropdownMenuState } from "../state";


export function useDrodownMenu(context: string) {
  const id = useMemo(() => nanoid(), []);
  const { activeMenu } = useSnapshot(dropdownMenuState);

  const visible = activeMenu[context] === id;

  return {
    visible,
    setVisible: (isVisible: boolean): void => {

      if (isVisible)
        dropdownMenuState.activeMenu[context] = id;
      else
        dropdownMenuState.activeMenu[context] = null;
    }
  };
}