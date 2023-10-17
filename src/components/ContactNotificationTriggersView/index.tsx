'use client'

import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { AppError } from "@/common/error";
import { AppToast } from "@/common/ui/toast";
import { NotificationTriggersApi } from "@/domains/notification-triggers/client-api";
import { Button } from "../Form";
import { useLoading } from "../AppLayout/Loading/hooks";
import NotificationTriggerCard from "../NotificationTriggerCard";
import { useNotificationTriggers } from "./hooks";

export default function ContactNotificationTriggersView({ contactId }: ContactNotificationTriggersViewProps) {

  const { data, isLoading: isLoadingTriggers, error, hasMore, loadNextPage, removeItem } = useNotificationTriggers({ contactId });
  const { isLoading, setLoading } = useLoading();

  const isEmpty = data.length == 0 && !isLoadingTriggers && !error;
  const isFirstLoading = isLoadingTriggers && data.length === 0;

  const handleDeleteTrigger = (triggerId: string) => async () => {

    setLoading(true);

    try {
      const api = new NotificationTriggersApi();
      await api.delete(triggerId);

      AppToast.success('Notificação excluida');

      removeItem(item => item.id === triggerId);
    }
    catch(e) {

      const error = AppError.parse(e);
      AppToast.error(error.message);
    }
    finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="bg-white border m-4">
        <ul className="divide-y">
          {data.map(item =>
            <li key={item.id}>
              <NotificationTriggerCard trigger={item} onDeleteClick={handleDeleteTrigger(item.id)} />
            </li>)}
          {isEmpty && <p className="text-center text-slate-400 p-4">Nenhuma notificação encontrada</p>}
          {isFirstLoading && <NotificationTriggerCard.Skeleton />}
          {error && <p className="text-center text-red-400 p-4">{error.message}</p>}
        </ul>
      </div>
      {hasMore &&
        <div className="text-center">
          <Button onClick={() => loadNextPage()} disabled={isLoadingTriggers} variant="textOnly"><ArrowDownTrayIcon className="h-5 w-5 inline-block" /> {isLoadingTriggers ? 'Carregando...' : 'Carregar dados'}</Button>
        </div>}
    </div>
  );
}

interface ContactNotificationTriggersViewProps {
    contactId: string;
}