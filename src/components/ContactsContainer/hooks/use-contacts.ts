import { FetcherKey, getKey } from "@/common/swr/models";
import { ContactsApi } from "@/domains/contacts/client-api";
import { Contact } from "@/domains/contacts/entities";
import { useFetchData } from "@/common/swr/fetch";


export const fetcher = ({ query, groupsId }: UseContactsArgs) => async (args: FetcherKey) => {

  const result = await new ContactsApi().getAll({
    offset: args.offset,
    limit: args.limit,
    query: query,
    groupsId: groupsId
  });

  return result;
}

export const useContacts = (args: UseContactsArgs) => {

  return useFetchData<Contact>({
    getKey: getKey('contacts', encodeURIComponent(JSON.stringify({ query: args.query, groupsId: args.groupsId }))),
    fetcher: fetcher(args)
  });
}

export interface UseContactsArgs {
  query?: string;
  groupsId?: string[];
}