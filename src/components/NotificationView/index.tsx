'use client'

import { Controller } from "react-hook-form";
import Skeleton from "react-loading-skeleton";
import { CheckIcon } from "@heroicons/react/24/outline";
import { TriggerType } from "@/domains/notification-triggers/entities";
import { FormRow, FormColumn, Input, Select, ButtonsGroup, ButtonItem, Button, DaysOfMonthSelect, MonthsSelect, ColSize } from "../Form";
import { useNotificationView, DefaultParamValue } from "./hooks";


export function NotificationView({ contactId, triggerId }: NotificationViewProps) {

  const {
    values,
    control,
    errors,
    messageTemplateParamsField,
    isLoadingMessageTemplates,
    messageTemplates,
    messageTemplatedSelected,
    isSaving,
    isLoaded,
    register,
    handleSubmit
  } = useNotificationView({ contactId, triggerId });

  if (!isLoaded)
    return <NotificationView.Skeleton />;

  return (
    <div className="container mx-auto max-w-3xl">
      <div className="bg-white border m-4 p-4">
        <div className="border-b pb-2 mb-4">
          <h2 className="text-xl">Criar notificação</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <FormRow>
            <FormColumn size={ColSize.full}>
              <label>Modelo de mensagem</label>
              <Select {...register('templateMessageId')}>
                <option value="">{isLoadingMessageTemplates ? 'Carregando...' : 'Selecionar...'}</option>
                { messageTemplates.map(item => <option value={item.id} key={item.id}>{item.name}</option>) }
              </Select>
              { errors.templateMessageId && <small className="text-red-400">{errors.templateMessageId.message}</small> }
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn size={ColSize.span2}>
              <Controller
                name={'triggerType'}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <ButtonsGroup>
                    <ButtonItem active={value === TriggerType.Daily} onClick={()=> onChange(TriggerType.Daily)}>Diária</ButtonItem>
                    <ButtonItem active={value === TriggerType.Monthy} onClick={()=> onChange(TriggerType.Monthy)}>Mensal</ButtonItem>
                    <ButtonItem active={value === TriggerType.Yearly} onClick={()=> onChange(TriggerType.Yearly)}>Anual</ButtonItem>
                </ButtonsGroup>
                )} />
            </FormColumn>
            <FormColumn size={ColSize.span1}>
              {values.triggerType !== TriggerType.Daily &&
              <div className="inline-flex flex-row h-full items-center">
                {(values.triggerType === TriggerType.Monthy || values.triggerType === TriggerType.Yearly) &&
                <div className="w-14">
                  <DaysOfMonthSelect {...register('day')} />
                </div>}
                {values.triggerType === TriggerType.Yearly &&
                <>
                  <span className="mx-2 inline-block">/</span>
                  <div className="w-24">
                    <MonthsSelect {...register('month')} />
                  </div>
                </>}
              </div>}
            </FormColumn>
          </FormRow>
          {(errors.day || errors.month) &&
          <FormRow>
            <FormColumn size={ColSize.full}>
              {errors.day && <small className="block text-red-400">Dia: {errors.day.message}</small>}
              {errors.month && <small className="block text-red-400">Mês: {errors.month.message}</small>}
            </FormColumn>
          </FormRow>}
          {messageTemplatedSelected?.params?.length as number > 0 &&
          <>
            <h4 className="mb-4">Parâmetros da mensagem</h4>
            <ul className="divide-y">
              {messageTemplateParamsField.fields.map((field, index) =>
              <li key={field.id} className="p-4 border bg-slate-100 mb-2">
                <label>{field.name}</label>
                <Input {...register(`messageTemplateParams.${index}.value` as const)} placeholder={field.name} disabled={field.value === DefaultParamValue} />
                { errors.messageTemplateParams?.at?.(index)?.value && <small className="text-red-400">{errors.messageTemplateParams.at(index)?.value?.message}</small> }
              </li>)}
            </ul>
          </>}
          <div className="text-center">
            <Button type="submit" disabled={isSaving}><CheckIcon className="h-5 w-5 inline-block" /> {isSaving ? 'Salvando...' : 'Salvar'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

NotificationView.Skeleton = function NotificationViewSkeleton() {

  return (
    <div className="container mx-auto max-w-3xl">
      <div className="bg-white border m-4 p-4">
        <div className="border-b pb-2 mb-4">
          <h2 className="text-xl">Criar notificação</h2>
        </div>
        <div>
          <FormRow>
            <FormColumn size={ColSize.full}>
              <label>Modelo de mensagem</label>
              <Skeleton height={30}/>
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn size={ColSize.span2}>
              <label>Dia</label>
              <div className="block max-w-xs" >
                <Skeleton height={30}/>
              </div>
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn size={ColSize.full}>
              <label>Parâmetros da mensagem</label>
              <Skeleton height={80} />
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn size={ColSize.full}>
              <div className="text-center mt-4">
                <Skeleton height={30} width={80} />
              </div>
            </FormColumn>
          </FormRow>
        </div>
      </div>
    </div>
  );
}

export interface NotificationViewProps {
  contactId: string;
  triggerId?: string;
}
