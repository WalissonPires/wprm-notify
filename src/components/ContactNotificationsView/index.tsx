'use client'

import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { Notification1 } from "@/domains/notifications/use-cases/entities";
import { NotificationsApi } from "@/domains/notifications/client-api";
import { AppToast } from "@/common/ui/toast";
import { AppError } from "@/common/error";
import { useLoading } from "../AppLayout/Loading/hooks";
import { Button } from "../Form";
import NotificationCard from "../NotificationCard";
import { NotificationCardSummary } from "../NotificationCardSummary";
import { useNotifications } from "./hooks";

export default function ContactNotificationsView({ contactId, isSended }: ContactNotificationsViewProps) {

  const { data, isLoading, error, hasMore, loadNextPage, refresh } = useNotifications({ contactId, isSended });
  const { setLoading } = useLoading();

  const isEmpty = data.length == 0 && !isLoading && !error;
  const isFirstLoading = isLoading && data.length === 0;

  const getHandleCancelNotification = (notify: Notification1) => async () => {

    setLoading(true);
    try {
      await new NotificationsApi().cancel(notify.id);
      refresh();
    }
    catch(error) {

      AppToast.warning(AppError.parse(error).message);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto">
      <NotificationCardSummary />
      <div className="bg-white border m-4">
        <ul className="divide-y">
          {data.map(item =>
            <li key={item.id}>
              <NotificationCard notification={item} showContact={!contactId} onCancelClick={getHandleCancelNotification(item)} />
            </li>)}
          {isEmpty && <p className="text-center text-slate-400 p-4">Nenhuma notificação encontrada</p>}
          {isFirstLoading && <NotificationCard.Skeleton />}
          {error && <p className="text-center text-red-400 p-4">{error.message}</p>}
        </ul>
      </div>
      {hasMore &&
        <div className="text-center">
          <Button onClick={() => loadNextPage()} disabled={isLoading} variant="textOnly"><ArrowDownTrayIcon className="h-5 w-5 inline-block" /> {isLoading ? 'Carregando...' : 'Carregar dados'}</Button>
        </div>}
    </div>
  );
}

interface ContactNotificationsViewProps {
    contactId?: string;
    isSended?: boolean;
}