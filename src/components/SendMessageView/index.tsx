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
    control,
    register,
    handleSubmit,
    activeJob
  } = useSendMessageView();

  return (
    <div className="container mx-auto max-w-3xl">
      <div className="bg-white border m-4 p-4 rounded shadow-sm">
        <div className="border-b pb-2 mb-4">
          <h2 className="text-xl font-semibold text-slate-800">Enviar Mensagem</h2>
        </div>
        <form onSubmit={handleSubmit}>
          <FormRow>
            <FormColumn size={ColSize.span2}>
              <label className="block text-sm font-medium text-slate-700 mb-1">Grupos</label>
              <Select {...register('groupsId')} multiple autoFocus className="w-full">
                <option value="">{isLoadingGroups ? 'Carregando...' : 'Selecionar...'}</option>
                { groups.map(item => <option value={item.id} key={item.id}>{item.name}</option>) }
              </Select>
              { errors.groupsId && <small className="text-red-400 mt-1 block">{errors.groupsId.message}</small> }
            </FormColumn>
          </FormRow>
          <FormRow>
            <FormColumn size={ColSize.span2}>
              <label className="block text-sm font-medium text-slate-700 mb-1">Mensagem</label>
              <Controller
                control={control}
                name="message"
                render={({ field: { value, onChange } })=>  <MessageEditor value={value} onChange={onChange} />} />
              <FieldError error={errors.message?.content} />
              <FieldError error={errors.message?.medias} />
            </FormColumn>
          </FormRow>
          <div className="text-center mt-4">
            <Button type="submit" disabled={isSaving} className="w-full sm:w-auto">
              <CheckIcon className="h-5 w-5 inline-block mr-1.5" /> 
              {isSaving ? 'Processando Envio...' : 'Enviar'}
            </Button>
          </div>

          {activeJob && (
            <div className="mt-6 border rounded-lg p-5 bg-slate-50 shadow-sm transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-slate-600">Progresso do Envio</span>
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${
                  activeJob.status === 'completed' ? 'bg-green-100 text-green-800' :
                  activeJob.status === 'failed' ? 'bg-red-100 text-red-800' :
                  activeJob.status === 'running' ? 'bg-blue-100 text-blue-800 animate-pulse' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {activeJob.status === 'completed' && 'Concluído'}
                  {activeJob.status === 'failed' && 'Falhou'}
                  {activeJob.status === 'running' && 'Enviando...'}
                  {activeJob.status === 'pending' && 'Pendente'}
                </span>
              </div>

              {/* Progress stats */}
              <div className="flex justify-between items-center text-sm mb-2 font-medium text-slate-700">
                <span>{activeJob.progress.success + activeJob.progress.failed} / {activeJob.progress.total} contatos</span>
                <span>
                  {activeJob.progress.total > 0 
                    ? Math.round(((activeJob.progress.success + activeJob.progress.failed) / activeJob.progress.total) * 100)
                    : 0}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 rounded-full h-3.5 mb-4 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ease-out ${
                    activeJob.status === 'completed' ? 'bg-green-500' :
                    activeJob.status === 'failed' ? 'bg-red-500' :
                    'bg-blue-500'
                  }`}
                  style={{ 
                    width: `${activeJob.progress.total > 0 
                      ? ((activeJob.progress.success + activeJob.progress.failed) / activeJob.progress.total) * 100
                      : 0}%` 
                  }}
                />
              </div>

              {/* Summary counters */}
              <div className="grid grid-cols-2 gap-4 text-center text-xs">
                <div className="bg-green-50 text-green-800 border border-green-200 rounded p-2">
                  <div className="font-bold text-lg">{activeJob.progress.success}</div>
                  <div className="text-green-600 font-medium font-semibold">Sucesso</div>
                </div>
                <div className="bg-red-50 text-red-800 border border-red-200 rounded p-2">
                  <div className="font-bold text-lg">{activeJob.progress.failed}</div>
                  <div className="text-red-600 font-medium font-semibold">Falha</div>
                </div>
              </div>

              {activeJob.error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded">
                  <strong>Erro:</strong> {activeJob.error}
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}