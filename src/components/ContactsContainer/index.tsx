'use client'

import ContactsView from "../ContactsView";
import { useContacts } from "./hooks/use-contacts";

export default function ContactsContainer() {

  const { data, isLoading, error, hasMore, loadNextPage } = useContacts();

  return (
    <ContactsView
      contacts={data}
      isLoading={isLoading}
      error={error}
      hasMore={hasMore}
      triggerLoadMore={() => loadNextPage()} />
  )
}
