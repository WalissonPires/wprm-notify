'use client'

import { useState } from "react";
import { useSeachAction } from "../AppLayout/Actions/SearchAction/hooks";
import { useContacts } from "./hooks/use-contacts";
import ContactsView from "../ContactsView";
import { useContactsFilter } from "../ContactsView/ContactsFilter/hooks";
import { ContactsFilter } from "../ContactsView/ContactsFilter";

export default function ContactsContainer() {

  const [ query, setQuery ]  = useState<string | undefined>(undefined);
  const { filters } = useContactsFilter();

  useSeachAction({
    onChange: value => {

      setQuery(value || undefined);
    }
  })

  const { data, isLoading, error, hasMore, loadNextPage } = useContacts({
    query,
    groupsId: filters.groups
  });

  return (
    <>
      <ContactsFilter />
      <ContactsView
        contacts={data}
        isLoading={isLoading}
        error={error}
        hasMore={hasMore}
        triggerLoadMore={() => loadNextPage()} />
    </>
  )
}
