import { FetcherKey, getKey } from "@/common/swr/models";
import { useFetchData } from "@/common/swr/fetch";
import { NotificationsApi } from "@/domains/notifications/client-api";
import { Notification1 } from "@/domains/notifications/use-cases/entities";


export const fetcher = (contactId: string) => async (args: FetcherKey) => {

  const result = await new NotificationsApi().getAll({
    offset: args.offset,
    limit: args.limit,
    contactId,
    isSended: true,
  });

  return result;
}

export const useNotifications = ({ contactId }: UseNotificationsProps) => {

  return useFetchData<Notification1>({
    getKey: getKey('notifications-by-contact'),
    fetcher: fetcher(contactId)
  });
}

export interface UseNotificationsProps {
  contactId: string;
}