'use client'

import { useRouter } from "next/navigation";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { AppToast } from "@/common/ui/toast";
import { AppError } from "@/common/error";
import { AppRoutes } from "@/common/routes";
import { GroupsApi } from "@/domains/groups/client-api";
import { Button } from "../Form";
import { useGroups } from "./hooks";
import { useLoading } from "../AppLayout/Loading/hooks";
import { ModalUtils } from "../Modal/Container/state";
import { ConfirmModal } from "../Modal/Confirm";
import GroupCard from "../GroupCard";

const modalDeleteConfirmId = 'group-delete-confirm';

export default function GroupsView() {

  const router = useRouter();
  const { data, isLoading: isLoadingGroups, error, hasMore, loadNextPage, removeItem } = useGroups();
  const { setLoading } = useLoading();

  const isEmpty = data.length == 0 && !isLoadingGroups && !error;
  const isFirstLoading = isLoadingGroups && data.length === 0;

  const getHandleGroupSelected = (groupId: string) => () => router.push(AppRoutes.viewGroup(groupId));

  const handleShowDeleteGroupConfirmModal = (groupId: string) => async () => {

    ModalUtils.show({
      id: modalDeleteConfirmId,
      modal: <ConfirmModal
        title="Deletar grupo"
        message="Tem certeza que deseja excluir esse grupo? O grupo será removido de todos os clientes vinculados."
        onDone={handleDeleteGroup(groupId)} />
    });
  };

  const handleDeleteGroup = (groupId: string) => async (confirmed: boolean) => {

    ModalUtils.hide(modalDeleteConfirmId);

    if (!confirmed)
      return;

    setLoading(true);

    try {
      const api = new GroupsApi();
      await api.delete(groupId);

      AppToast.success('Grupo excluido');

      removeItem(item => item.id === groupId);
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
              <GroupCard group={item} onEditClick={getHandleGroupSelected(item.id)} onDeleteClick={handleShowDeleteGroupConfirmModal(item.id)} />
            </li>)}
          {isEmpty && <p className="text-center text-slate-400 p-4">Nenhum grupo encontrado</p>}
          {isFirstLoading && <GroupCard.Skeleton />}
          {error && <p className="text-center text-red-400 p-4">{error.message}</p>}
        </ul>
      </div>
      {hasMore &&
        <div className="text-center">
          <Button onClick={() => loadNextPage()} disabled={isLoadingGroups} variant="textOnly"><ArrowDownTrayIcon className="h-5 w-5 inline-block" /> {isLoadingGroups ? 'Carregando...' : 'Carregar dados'}</Button>
        </div>}
    </div>
  );
}