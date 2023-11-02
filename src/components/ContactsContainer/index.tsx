'use client'

import { useState } from "react";
import { useSeachAction } from "../AppLayout/Actions/SearchAction/hooks";
import ContactsView from "../ContactsView";
import { useContacts } from "./hooks/use-contacts";

export default function ContactsContainer() {

  const [ query, setQuery ]  = useState<string | undefined>(undefined);

  useSeachAction({
    onChange: value => {

      setQuery(value || undefined);
    }
  })

  const { data, isLoading, error, hasMore, loadNextPage } = useContacts({
    query
  });

  return (
    <ContactsView
      contacts={data}
      isLoading={isLoading}
      error={error}
      hasMore={hasMore}
      triggerLoadMore={() => loadNextPage()} />
  )
}
