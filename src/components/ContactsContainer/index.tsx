'use client'

import { useState } from "react";
import { useSeachAction } from "../AppLayout/Actions/SearchAction/hooks";
import { useContacts } from "./hooks/use-contacts";
import ContactsView from "../ContactsView";
import { useContactsFilter } from "../ContactsView/ContactsFilter/hooks";
import { ContactsFilter } from "../ContactsView/ContactsFilter";
import { useLoading } from "../AppLayout/Loading/hooks";
import { Contact } from "../../domains/contacts/entities";
import { ContactsApi } from "../../domains/contacts/client-api";
import { AppToast } from "../../common/ui/toast";
import { AppError } from "../../common/error";

export default function ContactsContainer() {

  const [ query, setQuery ]  = useState<string | undefined>(undefined);
  const { filters } = useContactsFilter();
  const { setLoading } = useLoading();

  useSeachAction({
    onChange: value => setQuery(value || undefined)
  });

  const { data, isLoading, error, hasMore, loadNextPage, removeItem } = useContacts({
    query,
    groupsId: filters.groups
  });

  const handleDeleteContact = async (contact: Pick<Contact, 'id'>) => {

    setLoading(true);
    try {
      const api = new ContactsApi();
      await api.delete(contact.id);

      removeItem(x => x.id === contact.id);

      AppToast.success('Contato excluído');
    }
    catch(error) {

      AppToast.error(AppError.parse(error).message);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ContactsFilter />
      <ContactsView
        contacts={data}
        isLoading={isLoading}
        error={error}
        hasMore={hasMore}
        triggerLoadMore={() => loadNextPage()}
        onDeleteContact={handleDeleteContact} />
    </>
  )
}
