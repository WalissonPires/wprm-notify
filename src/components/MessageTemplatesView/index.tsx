'use client'

import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { AppToast } from "@/common/ui/toast";
import { AppError } from "@/common/error";
import { MessageTemplatesApi } from "@/domains/message-templates/client-api";
import { Button } from "../Form";
import MessageTemplateCard from "../MessageTemplateCard";
import { useMessageTemplates } from "./hooks";
import { useLoading } from "../AppLayout/Loading/hooks";

export default function MessageTemplatesView() {

  const { data, isLoading: isLoadingMessageTemplates, error, hasMore, loadNextPage, removeItem } = useMessageTemplates();
  const { setLoading } = useLoading();

  const isEmpty = data.length == 0 && !isLoadingMessageTemplates && !error;
  const isFirstLoading = isLoadingMessageTemplates && data.length === 0;


  const handleDeleteMessageTemplate = (messageTemplateId: string) => async () => {

    setLoading(true);

    try {
      const api = new MessageTemplatesApi();
      await api.delete(messageTemplateId);

      AppToast.success('Modelo de mensagem excluido');

      removeItem(item => item.id === messageTemplateId);
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
              <MessageTemplateCard messageTemplate={item} onDeleteClick={handleDeleteMessageTemplate(item.id)} />
            </li>)}
          {isEmpty && <p className="text-center text-slate-400 p-4">Nenhuma mensagem encontrada</p>}
          {isFirstLoading && <MessageTemplateCard.Skeleton />}
          {error && <p className="text-center text-red-400 p-4">{error.message}</p>}
        </ul>
      </div>
      {hasMore &&
        <div className="text-center">
          <Button onClick={() => loadNextPage()} disabled={isLoadingMessageTemplates} variant="textOnly"><ArrowDownTrayIcon className="h-5 w-5 inline-block" /> {isLoadingMessageTemplates ? 'Carregando...' : 'Carregar dados'}</Button>
        </div>}
    </div>
  );
}