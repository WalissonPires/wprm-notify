import { useSnapshot } from "valtio";
import { loadingState } from "../state";


export function useLoading() {

  const { isLoading } = useSnapshot(loadingState);

  return {
    isLoading,
    setLoading: (isLoading: boolean) => loadingState.isLoading = isLoading
  }
}
