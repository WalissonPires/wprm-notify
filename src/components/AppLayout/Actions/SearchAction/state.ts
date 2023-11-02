import { proxy } from "valtio";

export const searchActionState = proxy<SeachActionState>({
  enabled: false,
  value: ''
});

interface SeachActionState {
  enabled: boolean;
  value: string;
}