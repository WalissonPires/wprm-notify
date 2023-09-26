'use client'

import { useEffect, useState } from "react";
import { Contact } from "@/domains/contacts/entities";
import { ContactsApi } from "@/domains/contacts/api";
import ContactsView from "../ContactsView";

export default function ContactsContainer() {

  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {

    (async () => {

      const result = await new ContactsApi().getAll({
        offset: 0,
        limit: 20
      });

      setContacts(data => [...data, ...result.data]);

    })();

  }, []);

  return (
    <ContactsView contacts={contacts} />
  )
}
