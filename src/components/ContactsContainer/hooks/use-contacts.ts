import { FetcherKey, getKey } from "@/common/swr/models";
import { ContactsApi } from "@/domains/contacts/client-api";
import { Contact } from "@/domains/contacts/entities";
import { useFetchData } from "@/common/swr/fetch";


export const fetcher = async (args: FetcherKey) => {

  const result = await new ContactsApi().getAll({
    offset: args.offset,
    limit: args.limit
  });

  return result;
}

export const useContacts = () => {

  return useFetchData<Contact>({
    getKey: getKey('contacts'),
    fetcher: fetcher
  });
}
