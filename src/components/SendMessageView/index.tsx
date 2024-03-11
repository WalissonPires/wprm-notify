'use client'

import { CheckIcon } from "@heroicons/react/24/outline";
import { Controller } from "react-hook-form";
import { Button, FieldError, FormColumn, FormRow, Select, ColSize } from "../Form";
import { useSendMessageView } from "./hooks";
import { MessageEditor } from "../MessageEditor";

export function SendMessageView() {

  const {
    errors,
    isSaving,
    isLoadingGroups,
    groups,
    lastResult,
    showResultDetails,
    control,
    register,
    handleSubmit,
    handleShowResultDetails
  } = useSendMessageView();

  return (
    <div className="container mx-auto max-w-3xl">
      <div className="bg-white border m-4 p-4">
        <div className="border-b pb-2 mb-4">
          <h2 className="text-xl">Enviar Mensagem</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <FormRow>
            <FormColumn size={ColSize.span2}>
              <label>Grupos</label>
              <Select {...register('groupsId')} multiple autoFocus>
                <option value="">{isLoadingGroups ? 'Carregando...' : 'Selecionar...'}</option>
                { groups.map(item => <option value={item.id} key={item.id}>{item.name}</option>) }
              </Select>
              { errors.groupsId && <small className="text-red-400">{errors.groupsId.message}</small> }
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn size={ColSize.span2}>
              <label>Mensagem</label>
              <Controller
                control={control}
                name="message"
                render={({ field: { value, onChange } })=>  <MessageEditor value={value} onChange={onChange} />} />
              <FieldError error={errors.message?.content} />
              <FieldError error={errors.message?.medias} />
            </FormColumn>
          </FormRow>
          <div className="text-center mt-3">
            <Button type="submit" disabled={isSaving}><CheckIcon className="h-5 w-5 inline-block" /> {isSaving ? 'Enviando...' : 'Enviar'}</Button>
            {!showResultDetails && lastResult && lastResult.contacts.length > 0 && <Button variant="secondary" onClick={handleShowResultDetails} className="ml-3">Ver mais detalhes</Button>}
          </div>
          {lastResult &&
          <p className="p-2 bg-blue-50 text-blue-950 mt-5 flex justify-center flex-wrap items-center">{lastResult.sendedCount} Enviados, {lastResult.errorCount} Errors.</p>}
          {showResultDetails && lastResult &&
          <ul className="mt-5">
            {lastResult.contacts.map(contact =>
            <li key={contact.id} className="p-4 border">
              <h6>{contact.name}</h6>
              {contact.isSended && <p className="p-2 bg-green-300 text-green-950 rounded">Mensagem enviada</p>}
              {contact.errorMessage && <p className="p-2 bg-red-300 text-red-950 rounded">{contact.errorMessage}</p>}
            </li>)}
          </ul>}
        </form>
      </div>
    </div>
  );
}