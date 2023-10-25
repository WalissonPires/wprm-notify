'use client'

import { ContactsApi } from "@/domains/contacts/client-api";
import { AppLayoutBackWithTitle } from "..";
import { useFetchObjectData } from "@/common/swr/fetch";
import { FetcherKey, getKey } from "@/common/swr/models";


export const fetcher = (contactId: string) => async (args: FetcherKey) => {

  const contact = await new ContactsApi().getById(contactId);
  return contact;
}


export function AppLayoutBackWithContactTitle({ contactId }: AppLayoutBackWithContactTitleProps) {

  const { data } = useFetchObjectData({
    getKey: getKey('contact-by-id-' + contactId),
    fetcher: fetcher(contactId)
  });

  const { name } = data ?? {};

  return (
    <AppLayoutBackWithTitle title={name ?? '...'} />
  );
}

export interface AppLayoutBackWithContactTitleProps {
  contactId: string;
}