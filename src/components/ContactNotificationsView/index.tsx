'use client'

import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { Button } from "../Form";
import NotificationCard from "../NotificationCard";
import { useNotifications } from "./hooks";

export default function ContactNotificationsView({ contactId }: ContactNotificationsViewProps) {

  const { data, isLoading, error, hasMore, loadNextPage } = useNotifications({ contactId });

  const isEmpty = data.length == 0 && !isLoading && !error;
  const isFirstLoading = isLoading && data.length === 0;

  return (
    <div className="container mx-auto">
      <div className="bg-white border m-4">
        <ul className="divide-y">
          {data.map(item =>
            <li key={item.id}>
              <NotificationCard notification={item} />
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
    contactId: string;
}