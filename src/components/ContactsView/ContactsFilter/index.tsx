'use client'

import { ChangeEvent } from "react";
import { useSnapshot } from "valtio";
import { SubmitHandler, useForm } from "react-hook-form";
import { CheckIcon, AdjustmentsHorizontalIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Button, ColSize, FormColumn, FormRow, Input, Select } from "../../Form";
import { Modal, ModalHeader, ModalBody } from "../../Modal";
import { useGroups } from "../../Groups/hooks";
import { contactsFilterState, searchActionState } from "./state";


export function ContactsFilter() {

  const { opened } = useSnapshot(contactsFilterState);
  const { hasFilters } = useSnapshot(contactsFilterState);
  const { isLoading: isLoadingGroups, groups } = useGroups();
  const { register, handleSubmit, setValue, getValues } = useForm<Model>();
  const { value: searchValue } = useSnapshot(searchActionState);

  const handleClick = () => {

    contactsFilterState.opened = true;
  };

  const handleClose = () => {

    contactsFilterState.opened = false;
  };

  const handleClear = () => {

    setValue('groups', []);
    onSubmit(getValues());
  };


  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {

    searchActionState.value = event.target.value;
  };

  const onSubmit: SubmitHandler<Model> = async (data) => {

    if (data.groups?.at(0) === '')
      data.groups = [];

    contactsFilterState.filters = {
      groups: data.groups?.length > 0 ? data.groups : undefined
    };

    contactsFilterState.opened = false;
  };

  return (
    <>
    <div className="container mx-auto">
      <div className="bg-white border p-3 m-4">
        <div className="flex flex-row">
          <Input value={searchValue} onChange={handleChange} className="mr-3" placeholder="Nome, email ou telefone" />
          <Button onClick={handleClick} variant="transparent"><AdjustmentsHorizontalIcon className={'h-5 w-5 inline-block' + (hasFilters ? ' text-green-500' : '')} /></Button>
        </div>
      </div>
    </div>
      {opened &&
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
                  <Button type="submit" variant="primary"><CheckIcon className="h-5 w-5 inline-block" /> Aplicar</Button>
                  <Button onClick={handleClear} variant="secondary" className="ml-3"><TrashIcon className="h-5 w-5 inline-block" /> Limpar</Button>
                </div>
              </FormColumn>
            </FormRow>
          </form>
        </ModalBody>
      </Modal>}
    </>
  );
}

interface Model {
  groups: string[];
}