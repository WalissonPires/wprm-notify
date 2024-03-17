'use client'

import { useModals } from "./state";

export function ModalContainer() {

  const { modals } = useModals();
  const components = modals.map(info => info.modal);

  return <>{components}</>;
}