export interface PagedInput {
  offset: number;
  limit: number;
}

export interface PagedResult<TData> {
  offset: number;
  limit: number;
  count: number;
  data: TData[];
}