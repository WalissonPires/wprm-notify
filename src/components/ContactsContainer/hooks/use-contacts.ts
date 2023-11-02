import { FetcherKey, getKey } from "@/common/swr/models";
import { ContactsApi } from "@/domains/contacts/client-api";
import { Contact } from "@/domains/contacts/entities";
import { useFetchData } from "@/common/swr/fetch";


export const fetcher = ({ query }: UseContactsArgs) => async (args: FetcherKey) => {

  const result = await new ContactsApi().getAll({
    offset: args.offset,
    limit: args.limit,
    query: query
  });

  return result;
}

export const useContacts = (args: UseContactsArgs) => {

  return useFetchData<Contact>({
    getKey: getKey('contacts', args.query),
    fetcher: fetcher(args)
  });
}

export interface UseContactsArgs {
  query?: string;
}