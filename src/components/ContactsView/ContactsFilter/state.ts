import { proxy } from "valtio";

export const contactsFilterState = proxy<ContactsFilterState>({
  opened: false,
  filters: {},
  get hasFilters() {
    return this.filters.groups?.length > 0;
  }
});

interface ContactsFilterState {
  opened: boolean;
  filters: {
    groups?: string[];
  },
  readonly hasFilters: boolean;
}

export const searchActionState = proxy<SeachActionState>({
  enabled: false,
  value: ''
});

interface SeachActionState {
  enabled: boolean;
  value: string;
}