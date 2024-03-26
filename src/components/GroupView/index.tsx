'use client'

import { CheckIcon } from "@heroicons/react/24/outline";
import { Button, ColSize, FieldError, FormColumn, FormRow, Input } from "../Form";
import { useGroup } from "./hooks";

export interface GroupViewProps {
  groupId?: string;
}

export function GroupView({ groupId }: GroupViewProps) {

  const {
    errors,
    isSaving,
    register,
    handleSubmit
  } = useGroup({ groupId });


  return (
    <div className="container mx-auto max-w-3xl">
      <div className="bg-white border m-4 p-4">
        <div className="border-b pb-2 mb-4">
          <h2 className="text-xl">{groupId ? 'Editar grupo' : 'Criar grupo'}</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <FormRow>
            <FormColumn size={ColSize.span2}>
              <label>Nome</label>
              <Input {...register('name')} />
              <FieldError error={errors.name} />
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn size={ColSize.span2}>
              <label>Cor</label>
              <Input {...register('color')} type="color" />
              <FieldError error={errors.name} />
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