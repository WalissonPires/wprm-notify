import { useMemo } from "react";
import useSWRInfinite from "swr/infinite";
import { AppError } from "../error";
import { PagedResult } from "../http/pagination";
import { flatResult, DataResult, FetcherKey, GetKeyResult } from "./models";


export const useFetchData = <TData extends { id: string }>({ getKey, fetcher }: FetchDataArgs<TData>) => {

  const { data, size, setSize, isLoading, isValidating, error } = useSWRInfinite(getKey, fetcher, {
    revalidateFirstPage: false,
    keepPreviousData: true
  });

  const flattedData = useMemo(() => data ? flatResult(data) : [], [ data ]);

  const lastPage = data?.at(-1) ?? null;
  const accumulated = lastPage ? lastPage.offset + lastPage.limit : 0;
  const hasMore = lastPage ? accumulated < lastPage.count : true;

  const result: DataResult<TData> = {
    data: flattedData,
    isLoading: isValidating, //, isLoading
    error: error ? AppError.parse(error) : null,
    hasMore,
    loadNextPage: () => setSize(size + 1),
  };

  return result;
}

export interface FetchDataArgs<TData> {
  getKey: GetKeyResult;
  fetcher: (args: FetcherKey) => Promise<PagedResult<TData>>;
}