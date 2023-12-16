'use client'

import { useSnapshot } from "valtio";
import { SubmitHandler, useForm } from "react-hook-form";
import { CheckIcon, FunnelIcon as FunnelIconOutline } from "@heroicons/react/24/outline";
import { FunnelIcon as FunnelIconSolid } from "@heroicons/react/24/solid";
import { AppLayoutAction } from "@/components/AppLayout/Actions";
import { Modal, ModalHeader, ModalBody } from "../../Modal";
import { Button, ColSize, FormColumn, FormRow, Select } from "../../Form";
import { useGroups } from "../../Groups/hooks";
import { contactsFilterState } from "./state";


export function ContactsFilter() {

  const { opened } = useSnapshot(contactsFilterState);
  const { isLoading: isLoadingGroups, groups } = useGroups();

  const handleClose = () => {

    contactsFilterState.opened = false;
  };

  const { register, handleSubmit } = useForm<Model>();

  const onSubmit: SubmitHandler<Model> = async (data) => {

    if (data.groups?.at(0) === '')
      data.groups = [];

    contactsFilterState.filters = {
      groups: data.groups?.length > 0 ? data.groups : undefined
    };

    contactsFilterState.opened = false;
  };

  if (!opened) return null;

  return (
    <Modal>
      <ModalHeader onRequestClose={handleClose}>Filtrar contatos</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormRow>
            <FormColumn size={ColSize.full}>
              <label>Grupos</label>
              <Select {...register('groups')} multiple>
                {isLoadingGroups && <option value="">Carregando...</option>}
                {groups.map(group => <option value={group.id} key={group.id}>{group.name}</option>)}
              </Select>
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn size={ColSize.full}>
              <div className="text-center">
                <Button type="submit"><CheckIcon className="h-5 w-5 inline-block" /> Aplicar</Button>
              </div>
            </FormColumn>
          </FormRow>
        </form>
      </ModalBody>
    </Modal>
  );
}

export function ContactsFilterAction() {

  const { hasFilters } = useSnapshot(contactsFilterState);

  const handleClick = () => {

    contactsFilterState.opened = true;
  };

  return (
    <AppLayoutAction onClick={handleClick} title={hasFilters ? 'Filtros ativos' : 'Nenhum filtro ativo'}>
      {!hasFilters && <FunnelIconOutline className="h-5 w-5 " />}
      {hasFilters && <FunnelIconSolid className="h-5 w-5 " />}
    </AppLayoutAction>
  )
}

interface Model {
  groups: string[];
}