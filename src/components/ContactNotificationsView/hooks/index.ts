import { FetcherKey, getKey } from "@/common/swr/models";
import { useFetchData } from "@/common/swr/fetch";
import { NotificationsApi } from "@/domains/notifications/client-api";
import { Notification1 } from "@/domains/notifications/use-cases/entities";


export const fetcher = (contactId?: string, isSended?: boolean) => async (args: FetcherKey) => {

  const result = await new NotificationsApi().getAll({
    offset: args.offset,
    limit: args.limit,
    contactId,
    isSended
  });

  return result;
}

export const useNotifications = ({ contactId, isSended }: UseNotificationsProps) => {

  return useFetchData<Notification1>({
    getKey: getKey('notifications-by-contact-' + (contactId ?? 'all')),
    fetcher: fetcher(contactId, isSended)
  });
}

export interface UseNotificationsProps {
  contactId?: string;
  isSended?: boolean;
}