import { proxy } from "valtio";

export const loadingState = proxy<LoadingState>({
  isLoading: false
});


export interface LoadingState {
  isLoading: boolean;
}