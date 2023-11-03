import { useSnapshot } from "valtio";
import { contactsFilterState } from "./state";

export function useContactsFilter() {

  const { filters } = useSnapshot(contactsFilterState);

  return {
    filters: {
      groups: filters.groups ? Array.from(filters.groups) : undefined
    }
  };
}