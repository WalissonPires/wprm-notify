import { FetcherKey, getKey } from "@/common/swr/models";
import { useFetchData } from "@/common/swr/fetch";
import { GroupsApi } from "@/domains/groups/client-api";
import { Group } from "@/domains/groups/entities";


export const fetcher = async (args: FetcherKey) => {

  const result = await new GroupsApi().getAll({
    offset: args.offset,
    limit: args.limit
  });

  return result;
}

export const useGroups = () => {

  return useFetchData<Group>({
    getKey: getKey('groups'),
    fetcher: fetcher
  });
}