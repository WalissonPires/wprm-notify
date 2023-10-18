import { FetcherKey, getKey } from "@/common/swr/models";
import { useFetchData } from "@/common/swr/fetch";
import { MessageTemplatesApi } from "@/domains/message-templates/client-api";
import { MessageTemplate1 } from "@/domains/message-templates/entities";


export const fetcher = async (args: FetcherKey) => {

  const result = await new MessageTemplatesApi().getAll({
    offset: args.offset,
    limit: args.limit
  });

  return result;
}

export const useMessageTemplates = () => {

  return useFetchData<MessageTemplate1>({
    getKey: getKey('message-templates'),
    fetcher: fetcher
  });
}