import { useMemo } from "react";
import useSWRInfinite from "swr/infinite";
import { AppError } from "../error";
import { PagedResult } from "../http/pagination";
import { flatResult, DataResult, FetcherKey, GetKeyResult } from "./models";

export const useFetchObjectData =  <TData extends { id: string }>({ getKey, fetcher }: SingleFetchDataArgs<TData>) => {

  const { data, isValidating, error } = useSWRInfinite(getKey, fetcher, {
    revalidateFirstPage: true,
    revalidateIfStale: true,
    keepPreviousData: true
  });

  return {
    data: data?.at(0),
    isLoading: isValidating, //, isLoading
    error: error ? AppError.parse(error) : null,
  }
}

export interface SingleFetchDataArgs<TData> {
  getKey: GetKeyResult;
  fetcher: (args: FetcherKey) => Promise<TData>;
}



export const useFetchData = <TData extends { id: string }>({ getKey, fetcher }: FetchDataArgs<TData>) => {

  const { data, size, setSize, isLoading, isValidating, error, mutate } = useSWRInfinite(getKey, fetcher, {
    revalidateFirstPage: true,
    revalidateIfStale: true,
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
    removeItem: (select: (item: TData) => boolean) => {

      let removedCount = 0;

      if (!data) return;

      const newData = data.map(result => {

        const newResult = { ...result };
        newResult.data = result.data.filter(item => !select(item));

        return newResult;

      });

      for(const r of newData)
        r.count -= removedCount;

      mutate(newData);
    }
  };

  return result;
}

export interface FetchDataArgs<TData> {
  getKey: GetKeyResult;
  fetcher: (args: FetcherKey) => Promise<PagedResult<TData>>;
}