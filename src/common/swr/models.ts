import { AppError } from "../error";
import { PagedResult } from "../http/pagination";


export interface FetcherKey {
  offset: number;
  limit: number;
  context: string;
}

export interface GetKeyResult {
  <T>(pageIndex: number, previousData: PagedResult<T>): FetcherKey | null;
}

export interface DataResult<T> {
  data: T[];
  isLoading: boolean;
  error: AppError | null;
  hasMore: boolean;
  loadNextPage: () => void;
  removeItem: (select: (item: T) => boolean) => void;
}

export const Defaults = {
  limit: 50
}

export const getKey = (context: string) => <T>(pageIndex: number, previousData: PagedResult<T>): FetcherKey | null => {

  if (previousData) {

    const downloadCount = previousData.offset + previousData.limit;
    if (downloadCount >= previousData.count) return null;
  }

  const limit = Defaults.limit;

  return { offset: pageIndex * limit, limit, context };
}

export const flatResult = <T extends { id: string }>(groupedData: PagedResult<T>[]): T[] => {

  const flattedData: T[] = [];
  const index: Record<string, boolean> = {};

  for (const result of groupedData) {

    for (const item of result.data) {

      if (index[item.id]) continue;

      flattedData.push(item);
      index[item.id] = true;
    }
  }

  return flattedData;
}
