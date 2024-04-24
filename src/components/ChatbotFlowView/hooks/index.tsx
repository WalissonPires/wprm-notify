import { useState, useMemo, ChangeEvent, MouseEvent, useEffect } from "react";
import { AppError } from "@/common/error";
import { ChatNode, ChatNodeOutput, ProviderType } from "@/common/services/messaging/models";
import { AppToast } from "@/common/ui/toast";
import { MessageProvidersApi } from "@/domains/message-providers/client-api";
import { useLoading } from "../../AppLayout/Loading/hooks";
import { useDrodownMenu } from "../../Form/DropdownMenu/hooks";
import { ModalUtils } from "../../Modal/Container/state";
import { PromptModal } from "../../Modal/Prompt";
import { ChatbotFlowView } from "..";

export function useChatbotFlow() {

  const { setLoading } = useLoading();
  const [ ready, setReady ] = useState(false);

  const [ providerId, setProviderId ] = useState(0);
  const [ rootNode, setRootNode ] = useState<ChatNode | null>(null);
  const [ nodesPath, setNodesPath ] = useState<string[]>([]);
  const { visible, handleToggleDropdown, handleDropdownItemClick } = useDrodownMenu(ChatbotFlowView.name);

  const nodesIndex = useMemo(() => rootNode ? makeChatNodesIndex(rootNode) : {}, [ rootNode ]);

  const curretNodeId = nodesPath.at(-1);
  const currentNode = curretNodeId ? nodesIndex[curretNodeId] : null;


  const handleNext = (node: ChatNode) => () => {

    setNodesPath(nodes => [...nodes, node.id ]);
  };

  const handlePrevious = (node: ChatNode) => () => {

    setNodesPath(nodes => {

      const nodeIndex = nodes.findIndex(nodeId => nodeId === node.id);
      const nodesUpdateds = nodes.slice(0, nodeIndex + 1);

      return nodesUpdateds;
    });
  };

  const handleAddResponse = (type: 'text' | 'media-link') => (event: MouseEvent) => {

    handleDropdownItemClick(event);

    if (!currentNode || !rootNode) return;

    setRootNode(updateNode(rootNode, node => {

      if (node.id !== currentNode.id) return;

      node.output = [ ...node.output, { type, content: '' } ]
    }));
  };

  const handleShowAddChild = () => {

    if (!currentNode) return;

    ModalUtils.show({
      id: 'chatbot-flow-new-child',
      modal: <PromptModal title="Adicionar próxima mensagem" message="Nome da mensagem" onDone={handleAddChild} />
    });
  };

  const handleAddChild = (confirmed: boolean, childLabel: string | null) => {

    ModalUtils.hide('chatbot-flow-new-child');

    if (!currentNode || !rootNode || !confirmed || !childLabel) return;

    const newNode: ChatNode = {
      id: new Date().getTime().toString(),
      label: childLabel,
      pattern: '',
      output: [{ type: 'text', content: '' }],
      childs: []
    };

    setRootNode(updateNode(rootNode, node => {

      if (node.id !== currentNode.id) return;

      node.childs = [ ...node.childs, newNode ]
    }));

    setNodesPath(nodes => [ ...nodes, newNode.id ]);
  };

  const handleRemoveChild = (nodeSelected: ChatNode) => () => {

    if (!currentNode || !rootNode) return;

    setRootNode(updateNode(rootNode, node => {

      if (node.id !== currentNode.id) return;

      node.childs = node.childs.filter(x => x.id !== nodeSelected.id)
    }));
  };

  const handlePatternChange = (event: ChangeEvent<HTMLInputElement>) => {

    if (!currentNode || !rootNode) return;

    setRootNode(updateNode(rootNode, node => {

      if (node.id !== currentNode.id) return;

      node.pattern = event.target.value ?? '';
    }));
  }

  const handleOutputContentChange = ({ type, content }: ChatNodeOutput) => (event: ChangeEvent<HTMLPreElement>) => {

    if (!currentNode || !rootNode) return;

    setRootNode(updateNode(rootNode, node => {

      if (node.id !== currentNode.id) return;

      node.output = updateArrayItem(node.output,
        x => x.content === content,
        () => ({ type, content: event.currentTarget.innerText ?? ''  }))
    }));
  };

  const handleRemoveOutput = ({ content }: ChatNodeOutput) => (event: MouseEvent) => {

    if (!currentNode || !rootNode) return;

    setRootNode(updateNode(rootNode, node => {

      if (node.id !== currentNode.id) return;

      node.output = node.output.filter(x => x.content !== content)
    }));
  };

  const handleSave = async () => {

    if (!rootNode) return;

    setLoading(true);

    try {
      const api = new MessageProvidersApi();

      await api.updateChatbotFlow({
        providerId: providerId,
        chatbotFlow: rootNode
      });

      AppToast.success('Diálogo salvo');
    }
    catch (error) {

      AppToast.error(AppError.parse(error).message);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {

      (async () => {

        try {
          const api = new MessageProvidersApi();
          const providersStatus = await api.getProvidersStatus();

          const whatsappProvider = providersStatus?.find(x => x.type === ProviderType.Whatsapp);
          if (!whatsappProvider) {
            AppToast.error('Configure a integração com Whatsapp para ter acesso ao chatbot');
            return;
          }

          const rootNode = await api.getChatbotFlow({ id: whatsappProvider.id }) ?? { id: 'inicial', label: 'Mensagem inicial', childs: [], output: [{ type: 'text', content: 'Olá! Pronto pra começar' }], pattern: '.*' };

          setRootNode(rootNode);
          setNodesPath([rootNode.id]);
          setProviderId(whatsappProvider.id);
          setReady(true);
        }
        catch (error) {

          AppToast.error(AppError.parse(error).message);
        }

      })();

  }, []);

  return {
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
  };
}


const updateArrayItem = <T,>(array: T[], selector: (item: T) => boolean, newItem: (item: T) => T) => {

  const newArray = [];
  for(let i = 0; i < array.length; i++) {

    if (selector(array[i]))
      newArray[i] = newItem(array[i]);
    else
      newArray[i] = array[i];
  }

  return newArray;
};

function makeChatNodesIndex(root: ChatNode) {

  const index: Record<string, ChatNode> = {};

  const visit = (node: ChatNode) => {

    if (index[node.id])
      throw new Error('Duplicate node id: ' + node.id);

    index[node.id] = node;
    for(const child of node.childs) {
      visit(child);
    }
  };

  visit(root);

  return index;
}

function getNodeFromPath(nodesPath: string[], rootNode: ChatNode) {

  let parentNode = null;
  let node = rootNode;
  for(const nodeId of nodesPath) {

    if (nodeId === node.id)
      continue;

    const child = node.childs.find(x => x.id == nodeId);
    if (!child)
      throw new Error('Node not found in path: ' + nodesPath.join("/"));

    parentNode = node;
    node = child;
  }

  return { parentNode, node };
}

function updateNode(rootNode: ChatNode, update: (node: ChatNode) => void) {

  const newRootNode = {
    ...rootNode
  };

  update(newRootNode);

  newRootNode.childs = newRootNode.childs.map(child => updateNode(child, update));

  return newRootNode;
}