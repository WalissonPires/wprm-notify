'use client'

import { CheckIcon } from "@heroicons/react/24/outline";
import { Masks } from "@/common/validation/masks";
import { Button, FieldError, FormColumn, FormRow, Input, Select, InputMask, ColSize } from "../Form";
import { useContactView } from "./hooks";


export function ContactView() {

  const {
    errors,
    isSaving,
    isLoadingGroups,
    groups,
    register,
    handleSubmit
  } = useContactView();

  return (
    <div className="container mx-auto max-w-3xl">
      <div className="bg-white border m-4 p-4">
        <div className="border-b pb-2 mb-4">
          <h2 className="text-xl">Criar contato</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <FormRow>
            <FormColumn size={ColSize.s1s2}>
              <label>Nome</label>
              <Input {...register('name')} />
              <FieldError error={errors.name} />
            </FormColumn>
            <FormColumn size={ColSize.s1s2}>
              <label>Grupos</label>
              <Select {...register('groupsId')} multiple>
                <option value="">{isLoadingGroups ? 'Carregando...' : 'Selecionar...'}</option>
                { groups.map(item => <option value={item.id} key={item.id}>{item.name}</option>) }
              </Select>
              { errors.groupsId && <small className="text-red-400">{errors.groupsId.message}</small> }
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn size={ColSize.s1s2}>
              <label>Telefone</label>
              <InputMask mask={Masks.phone} {...register('phone')} />
              <FieldError error={errors.phone} />
            </FormColumn>
            <FormColumn size={ColSize.s1s2}>
              <label>Email</label>
              <Input {...register('email')} />
              <FieldError error={errors.email} />
            </FormColumn>
          </FormRow>
          <div className="text-center mt-3">
            <Button type="submit" disabled={isSaving}><CheckIcon className="h-5 w-5 inline-block" /> {isSaving ? 'Salvando...' : 'Salvar'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}