'use client'

import { CheckIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { Button, FieldError, FormColumn, FormRow, Input, TextArea } from "../Form";
import { useMessageTemplate } from "./hooks";


export function MessageTemplateView() {

  const {
    //values,
    //paramsField,
    paramsNames,
    errors,
    isSaving,
    register,
    handleSubmit,
    //handleAddParam
  } = useMessageTemplate();

  return (
    <div className="container mx-auto max-w-3xl">
      <div className="bg-white border m-4 p-4">
        <div className="border-b pb-2 mb-4">
          <h2 className="text-xl">Criar modelo de mensagem</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <FormRow>
            <FormColumn portion={1} amount={1}>
              <label>Nome</label>
              <Input {...register('name')} />
              <FieldError error={errors.name} />
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn portion={1} amount={1}>
              <label>Mensagem</label>
              <TextArea {...register('content')} />
              <FieldError error={errors.content} />
            </FormColumn>
          </FormRow>
          <h4 className="mb-4">Parâmetros da mensagem</h4>
          <p className="bg-green-100 p-3 mb-5">
            As partes de sua mensagem que não são fixas podem ser definidas usando <b>parâmetros</b>. Um <b>parâmetro</b> é um texto no formato <b>{'{{texto}}'}</b> que será substituido mais tarde.
            Como exemplo: <b>Feliz aniversário {'{{nome}}'}. Muitas felicidades!</b>
          </p>
          {paramsNames.map(name => <span key={name} className="bg-slate-400 text-white py-2 px-3 rounded mr-3">{name}</span>)}
          {paramsNames.length === 0 && <p className="text-slate-400 text-center">Nenhum parâmetro encontrado na mensagem</p>}
          {/* <h4 className="mb-4">Parâmetros da mensagem</h4>
          <ul className="divide-y">
            <li className="mb-3">
              <Button onClick={handleAddParam} variant="transparent" className="w-full"><PlusCircleIcon className="inline-block h-5 w-5" /> Adicionar parâmetro</Button>
            </li>
            {paramsField.fields.map((field, index) =>
            <li key={field.id} className="p-4 border bg-slate-100 mb-2">
              <label>{field.name}</label>
              <Input {...register(`params.${index}.name` as const)} placeholder="Nome do parâmetro" />
              <FieldError error={errors.params?.at?.(index)?.name} />
            </li>)}
          </ul> */}
          <div className="text-center mt-3">
            <Button type="submit" disabled={isSaving}><CheckIcon className="h-5 w-5 inline-block" /> {isSaving ? 'Salvando...' : 'Salvar'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}