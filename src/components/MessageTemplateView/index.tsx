'use client'

import { DOMAttributes, PropsWithChildren, useMemo } from "react";
import { CheckIcon } from "@heroicons/react/24/outline";
import { ClipboardDocumentIcon } from "@heroicons/react/24/solid";
import { DefaultParamsUtils } from "@/domains/message-templates/default-params";
import { AppToast } from "@/common/ui/toast";
import { Button, ColSize, FieldError, FormColumn, FormRow, Input, TextArea } from "../Form";
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

  const defaultParams = useMemo(() => Object.values(new DefaultParamsUtils().getAllParamsDefaultLanguage()), []);

  const handleDefaultParamClicked = (param: string) => {

    navigator.clipboard.writeText('{{' + param + '}}');
    AppToast.info('Parâmetro copiado');
  };

  return (
    <div className="container mx-auto max-w-3xl">
      <div className="bg-white border m-4 p-4">
        <div className="border-b pb-2 mb-4">
          <h2 className="text-xl">Criar modelo de mensagem</h2>
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
              <label>Notificar dias antes</label>
              <Input {...register('notifyDaysBefore')} />
              <FieldError error={errors.notifyDaysBefore} />
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn size={ColSize.full}>
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
          <p className="bg-green-100 p-3 mb-5">
            Esses são algums parâmetros padrões que você pode utilizar e o sistema irá preencher para você:
            <div className="flex text-xs">
                {defaultParams.map(param => <TagParam key={param} onClick={() => handleDefaultParamClicked(param)}>{`{{${param}}}`} <ClipboardDocumentIcon className="h-4 w-4 inline-block" /></TagParam>)}
              </div>
          </p>
          {paramsNames.map(name => <TagParam key={name}>{name}</TagParam>)}
          {paramsNames.length === 0 && <p className="text-slate-400 text-center">Nenhum parâmetro encontrado na mensagem</p>}
          <div className="text-center mt-3">
            <Button type="submit" disabled={isSaving}><CheckIcon className="h-5 w-5 inline-block" /> {isSaving ? 'Salvando...' : 'Salvar'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TagParam({ children, onClick }: PropsWithChildren & Pick<DOMAttributes<HTMLElement>, 'onClick'>) {

  return <p onClick={onClick} className="bg-slate-400 text-white py-2 px-3 rounded mr-3">{children}</p>;
}