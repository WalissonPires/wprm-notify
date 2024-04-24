import { MouseEvent, useMemo } from "react";
import { useSnapshot } from "valtio";
import { nanoid } from "nanoid/non-secure";
import { dropdownMenuState } from "../state";


export function useDrodownMenu(context: string) {
  const id = useMemo(() => nanoid(), []);
  const { activeMenu } = useSnapshot(dropdownMenuState);

  const visible = activeMenu[context] === id;

  const setVisible = (isVisible: boolean) => {

    if (isVisible)
      dropdownMenuState.activeMenu[context] = id;
    else
      dropdownMenuState.activeMenu[context] = null;
  };

  const handleToggleDropdown = (event: MouseEvent) => {

    event.stopPropagation();
    event.preventDefault();
    setVisible(!visible);
  };

  const handleDropdownItemClick = (event: MouseEvent) => {

    event.stopPropagation();
    event.preventDefault();
    setVisible(false);
  };


  return {
    visible,
    setVisible,
    handleToggleDropdown,
    handleDropdownItemClick
  };
}