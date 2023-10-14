import { FetcherKey, getKey } from "@/common/swr/models";
import { useFetchData } from "@/common/swr/fetch";
import { Trigger1 } from "@/domains/notification-triggers/entities";
import { NotificationTriggersApi } from "@/domains/notification-triggers/client-api";


export const fetcher = (contactId: string) => async (args: FetcherKey) => {

  const result = await new NotificationTriggersApi().getAll({
    offset: args.offset,
    limit: args.limit,
    contactId
  });

  return result;
}

export const useNotificationTriggers = ({ contactId }: UseNotificationTriggersProps) => {

  return useFetchData<Trigger1>({
    getKey: getKey('notification-triggers-by-contact'),
    fetcher: fetcher(contactId)
  });
}

export interface UseNotificationTriggersProps {
  contactId: string;
}