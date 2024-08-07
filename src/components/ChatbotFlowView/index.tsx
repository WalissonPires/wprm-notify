'use client'

import Skeleton from "react-loading-skeleton";
import { ArrowRightIcon, ChatBubbleBottomCenterTextIcon, ChevronDownIcon, ChevronRightIcon, ChevronUpIcon, EnvelopeIcon, EyeIcon, FilmIcon, PlusIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button, ColSize, DropdownMenu, DropdownMenuItem, FormColumn, FormRow, Input, Select } from "../Form";
import { ChatNodeActionDisplay, ChatNodePatternTypeAdditional, UserBuildinPatternsDisplay, useChatbotFlow } from "./hooks";
import { AnyText, ChatNodeAction, ChatNodePatternType, GoToNodeParams } from "../../common/services/messaging/models";
import { getEnumPairValue } from "../../common/primitives/enum/enum-utils";
import { Collapse } from "../Form/Collapse";


export function ChatbotFlowView() {

  const {
    ready,
    currentNode,
    nodesIndex,
    nodesPath,
    visible,
    isSaving,
    chatbotActive,
    getNodesList,
    handleToggleDropdown,
    handleNext,
    handlePrevious,
    handleMoveDownChild,
    handleMoveUpChild,
    handleAddResponse,
    handleShowAddChild,
    handleRemoveChild,
    handleLabelChange,
    handlePatternChange,
    handleDelayChange,
    handlePatternTypeChange,
    handleActionTypeChange,
    handleActionParamTriggerAtStartChange,
    handleGoToNodeParamNodeIdChange,
    handleOutputContentChange,
    handleRemoveOutput,
    handleOpenLink,
    handleSave,
    handleSetChatbotStatus
  } = useChatbotFlow();

  if (!ready)
    return <ChatbotFlowView.Skeleton />;

  const isAnyTextPattern = currentNode?.patternType === ChatNodePatternType.Regex && currentNode?.pattern == AnyText;
  const patternType = isAnyTextPattern ? ChatNodePatternTypeAdditional.AnyText : currentNode?.patternType;
  const pattern = isAnyTextPattern ? '' : (currentNode?.pattern ?? '');

  return (
    <div className="container mx-auto max-w-3xl">
      <div className="bg-white border m-4 p-4">
        <div className="border-b pb-2 mb-4">
          <ul className="flex flex-row flex-wrap items-center list-none">
            {nodesPath.map((nodeId, index) => {

              const node = nodesIndex[nodeId];

              return (
                <>
                  {index > 0 && <li className="mx-2"><ChevronRightIcon className="h-5 w-5" /></li>}
                  <li key={node.id}>
                    {node.id === currentNode?.id ? node.label : <a href="#" className="text-blue-500 hover:underline" onClick={handlePrevious(node)}>{node.label}</a>}
                  </li>
                </>
              );
            })}
          </ul>
        </div>
        <div>
          <div className="flex flex-row justify-between mb-2">
            <div className="max-w-sm flex flex-row items-center">
              <label>Status: </label>
              <Select value={chatbotActive?.toString() ?? ''} onChange={handleSetChatbotStatus}>
                {chatbotActive === null &&
                  <option value=''>Carregando...</option>}
                {chatbotActive !== null && <>
                  <option value="true">Ativado</option>
                  <option value="false">Desativado</option></>}
              </Select>
            </div>
            <Button onClick={handleSave} disabled={isSaving}>{isSaving ? 'Salvando ...' : 'Salvar'}</Button>
          </div>
          <div className="mb-6">
            <label className="block font-bold">Título</label>
            <Input value={currentNode?.label ?? ''} onChange={handleLabelChange} placeholder="Título" className="flex-1 mr-2" />
          </div>
          <div className="mb-6">
            <label className="block font-bold">Mensagem do usuário</label>
            <div className="flex flex-row">
              {/* <label className="flex flex-row items-center p-2 bg-slate-100">
                <input type="checkbox" className="mr-2" checked={currentNode?.pattern === AnyText} onChange={handleAnyTextChange} />
                <span>Qualquer texto</span>
              </label> */}
              <div>
                <Select defaultValue={ChatNodePatternType.Contains} value={patternType} onChange={handlePatternTypeChange}>
                  {getEnumPairValue(UserBuildinPatternsDisplay).map(({ value, text }) => <option value={value} key={value}>{text}</option>)}
                </Select>
              </div>
              <Input value={pattern} onChange={handlePatternChange} disabled={isAnyTextPattern} placeholder="Mensagem" className="flex-1 mr-2" />
            </div>
          </div>

          <Collapse title="Mais configurações">
            <FormRow>
              <FormColumn size={ColSize.span2}>
                <label className="block font-bold">Tempo espera</label>
                <Input value={currentNode?.delay ?? ''} onChange={handleDelayChange} placeholder="Tempo em segundos" />
              </FormColumn>
            </FormRow>
            <FormRow>
              <FormColumn size={ColSize.span2}>
                <label className="block font-bold">Ação</label>
                <Select defaultValue={''} value={currentNode?.action?.type ?? ''} onChange={handleActionTypeChange}>
                  <option value="">Nenhuma</option>
                  {getEnumPairValue(ChatNodeActionDisplay).map(({ value, text }) => <option value={value} key={value}>{text}</option>)}
                </Select>
              </FormColumn>
            </FormRow>
            {currentNode?.action && <FormRow>
              <FormColumn size={ColSize.span2}>
                <label className="block font-bold">Quando acionar</label>
                <Select defaultValue={'false'} value={currentNode?.action?.params?.triggerAtStart?.toString() ?? 'false'} onChange={handleActionParamTriggerAtStartChange}>
                  <option value="false">No final, após enviar mensagem resposta</option>
                  <option value="true">No início, sem enviar mensagem resposta</option>
                </Select>
              </FormColumn>
            </FormRow>}
            {currentNode?.action?.type == ChatNodeAction.GoToNode &&
              <FormRow>
                <FormColumn size={ColSize.span2}>
                  <label className="block font-bold">Mensagem dest.</label>
                  <Select defaultValue={''} value={(currentNode?.action?.params as GoToNodeParams)?.nodeId} onChange={handleGoToNodeParamNodeIdChange}>
                    {getNodesList().filter(x => x.id !== currentNode?.id).map(node => <option value={node.id} key={node.id}>{node.label}</option>)}
                  </Select>
                </FormColumn>
              </FormRow>}
          </Collapse>

          <div className="mt-3">
            <div className="flex flex-row flex-wrap justify-between items-center mb-3">
              <label className="block  font-bold">Respostas</label>
              <div>
                <DropdownMenu
                  visible={visible}
                  toggle={
                    <Button onClick={handleToggleDropdown} variant="transparent">
                      <span className="mr-2">Nova resposta</span>
                      <ChevronDownIcon className="h-5 w-5 inline-block" title="Adicionar resposta" />
                    </Button>
                  }>
                  <DropdownMenuItem onClick={handleAddResponse('text')}>
                    <span><EnvelopeIcon className="h-5 w-5 inline-block" /> Texto</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleAddResponse('media-link')}>
                    <span><FilmIcon className="h-5 w-5 inline-block" /> Image/Vídeo/Audio</span>
                  </DropdownMenuItem>
                </DropdownMenu>
              </div>
            </div>
            {currentNode?.output.map((output) =>
              <div key={output.type + output.content} className="relative border mb-2">
                <div className="flex items-center justify-between p-2 bg-slate-200">
                  {output.type === 'text' && <small>Mensagem de texto</small>}
                  {output.type === 'media-link' && <small>Link multimidia</small>}
                  <div className="flex flex-row">
                    {output.type === 'media-link' &&
                      <EyeIcon className="h-5 w-5 text-blue-400 mr-2" onClick={handleOpenLink(output)} title="Visualizar mídia" />}
                    <XMarkIcon className="h-5 w-5 text-red-400" onClick={handleRemoveOutput(output)} title="Remover mensagem" />
                  </div>
                </div>
                <pre onBlur={handleOutputContentChange(output)} contentEditable className={'w-full overflow-hidden whitespace-pre-wrap bg-slate-100 p-2' + (output.type === 'media-link' ? ' text-blue-600' : '')}>{output.content}</pre>
              </div>)}
          </div>

          <div className="flex flex-row flex-wrap justify-between items-center">
            <label className="block font-bold">Próximas mensagens</label>
            <Button onClick={handleShowAddChild} variant="transparent"><PlusIcon className="h-5 w-5 inline-block" title="Adicionar próxima mensagem" /></Button>
          </div>
          <ul className="list-none">
            {currentNode?.childs.length === 0 && <li className="mt-3"><small className="text-slate-400">Fim da conversa. Clique no botão <b>+</b> para continuar o diálogo.</small></li>}
            {currentNode?.childs.map(node => (
              <li key={node.id} className="border-b py-4 flex flex-row flex-wrap justify-between items-center">
                <Button onClick={handleNext(node)} variant="textOnly" className="text-left flex-1">
                  <span className="block"><ChatBubbleBottomCenterTextIcon className="h-5 w-5 inline-block" /> {node.label}</span>
                </Button>
                <div className="text-right flex flex-row items-center">
                  <Button variant="transparent" onClick={handleNext(node)} ><ArrowRightIcon className="h-5 w-5 inline-block text-blue-500" title="Avançar" /></Button>
                  <Button variant="transparent" onClick={handleRemoveChild(node)}><TrashIcon className="h-5 w-5 inline-block text-red-400" title="Excluír mensagem" /></Button>
                  <div className="inline-flex flex-col ml-2">
                    <ChevronUpIcon onClick={handleMoveUpChild(node)} className="h-5 w-5 inline-block text-blue-500 p-1" title="Mover para cima" />
                    <ChevronDownIcon onClick={handleMoveDownChild(node)} className="h-5 w-5 inline-block text-blue-500 p-1" title="Mover para baixo" />
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
ChatbotFlowView.Skeleton = function ChatbotFlowViewSkeleton() {

  return (
    <div className="container mx-auto max-w-3xl">
      <div className="bg-white border m-4 p-4">
        <div className="border-b pb-2 mb-4">
          <Skeleton className="" />
        </div>
        <div className="mb-2 text-right">
          <Button disabled>Salvar</Button>
        </div>
        <div>
          <label className="block font-bold">Mensagem do usuário</label>
          <Skeleton className="" />
        </div>
        <div className="mt-3">
          <div className="flex flex-row flex-wrap justify-between items-center mb-3">
            <label className="block  font-bold">Respostas</label>
          </div>
          <Skeleton height={40} className="mb-2" />
          <Skeleton height={40} className="mb-2" />
          <Skeleton height={40} className="mb-2" />
        </div>
      </div>
    </div>
  );
}