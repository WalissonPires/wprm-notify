import { proxy } from "valtio";


export const dropdownMenuState = proxy<DropdownMenuState>({
  activeMenu: {}
});

export interface DropdownMenuState {
  activeMenu: Record<string, string | null>;
}