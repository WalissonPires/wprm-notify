'use client'

import Skeleton from "react-loading-skeleton";
import { ArrowRightIcon, ChatBubbleBottomCenterTextIcon, ChevronDownIcon, ChevronRightIcon, EnvelopeIcon, FilmIcon, PlusIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button, DropdownMenu, DropdownMenuItem, Input } from "../Form";
import { useChatbotFlow } from "./hooks";


export function ChatbotFlowView() {

  const {
    ready,
    currentNode,
    nodesIndex,
    nodesPath,
    visible,
    handleToggleDropdown,
    handleNext,
    handlePrevious,
    handleAddResponse,
    handleShowAddChild,
    handleRemoveChild,
    handlePatternChange,
    handleOutputContentChange,
    handleRemoveOutput,
    handleSave,
  } = useChatbotFlow();

  if (!ready)
    return <ChatbotFlowView.Skeleton />;

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
          <div className="mb-2 text-right">
            <Button onClick={handleSave}>Salvar</Button>
          </div>
          <div>
            <label className="block font-bold">Mensagem do usuário</label>
            <Input value={currentNode?.pattern ?? ''} onChange={handlePatternChange} placeholder="Regex" className="flex-1 mr-2" />
          </div>

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
                  <XMarkIcon className="h-5 w-5 text-red-400" onClick={handleRemoveOutput(output)} />
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
            {currentNode?.childs.map(node => { console.log(node); return (
              <li key={node.id} className="border-b py-4 flex flex-row flex-wrap justify-between items-center">
                <Button onClick={handleNext(node)} variant="textOnly" className="text-left flex-1">
                  <span className="block"><ChatBubbleBottomCenterTextIcon className="h-5 w-5 inline-block" /> {node.label}</span>
                </Button>
                <div className="text-right">
                  <Button variant="transparent" onClick={handleNext(node)} ><ArrowRightIcon className="h-5 w-5 inline-block text-blue-500" title="Avançar" /></Button>
                  <Button variant="transparent" onClick={handleRemoveChild(node)}><TrashIcon className="h-5 w-5 inline-block text-red-400" title="Excluír mensagem" /></Button>
                </div>
              </li>
            )})}
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