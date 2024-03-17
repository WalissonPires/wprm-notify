import { proxy, useSnapshot } from "valtio";

const modalState = proxy<ModalState>({
  modals: []
});

interface ModalState {
  modals: ModalInfo[];
}

interface ModalInfo {
  id: string;
  modal: React.ReactNode;
}

export class ModalUtils {

  public static show(info: ModalInfo) {

    modalState.modals.push(info);
  }

  public static hide(infoId: string) {

    const infoIndex = modalState.modals.findIndex(x => x.id === infoId);
    modalState.modals.splice(infoIndex, 1);
  }
}

export function useModals() {

  const snapModals =  useSnapshot(modalState);

  return {
    // Tentar renderizar os componentes do snapshot causa o erro:
    // TypeError: Cannot assign to read only property 'validated' of object '#<Object>'
    //modals: snapModals.modals,
    // Usar diretamente o estado. Mas mante o useSnapshot para obter sempre uma cópia atualizada do estado
    modals: modalState.modals
  }
}