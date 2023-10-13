import { useMemo } from "react";
import useSWRInfinite from "swr/infinite";
import { AppError } from "@/common/error";
import { FetcherKey, getKey, flatResult, DataResult } from "@/common/swr/models";
import { ContactsApi } from "@/domains/contacts/client-api";
import { Contact } from "@/domains/contacts/entities";


export const fetcher = async (args: FetcherKey) => {

  const result = await new ContactsApi().getAll({
    offset: args.offset,
    limit: args.limit
  });

  return result;
}

export const useContacts = () => {

  const { data, size, setSize, isLoading, isValidating, error } = useSWRInfinite(getKey('contacts'), fetcher, {
    revalidateFirstPage: false,
    keepPreviousData: true
  });

  const flattedData = useMemo(() => data ? flatResult(data) : [], [ data ]);

  const lastPage = data?.at(-1) ?? null;
  const accumulated = lastPage ? lastPage.offset + lastPage.limit : 0;
  const hasMore = lastPage ? accumulated < lastPage.count : true;

  const result: DataResult<Contact> = {
    data: flattedData,
    isLoading: isValidating, //, isLoading
    error: error ? AppError.parse(error) : null,
    hasMore,
    loadNextPage: () => setSize(size + 1),
  };

  return result;
}
