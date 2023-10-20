import { PlusIcon } from '@heroicons/react/24/outline';
import { AppLayout } from '@/components/AppLayout';
import { AppLayoutBody } from '@/components/AppLayout/Body';
import { AppLayoutHeader } from '@/components/AppLayout/Header';
import { AppLayoutMenuWithTitle } from '@/components/AppLayout/MenuWithTitle';
import { AppNavMenuDefault, AppNavMenuItens } from '@/components/AppLayout/NavMenu';
import { AppLayoutAction, AppLayoutActions } from '@/components/AppLayout/Actions';
import { AppRoutes } from '@/common/routes';
import MessageTemplatesView from '@/components/MessageTemplatesView';

export default function MessageTemplates() {

  return (
    <AppLayout>
      <AppLayoutHeader>
        <AppLayoutMenuWithTitle title="Modelos de mensagens" />
        <AppLayoutActions>
          <AppLayoutAction title="Criar modelo de mensagem" href={AppRoutes.newMessageTemplates()}><PlusIcon className="h-5 w-5"></PlusIcon></AppLayoutAction>
        </AppLayoutActions>
      </AppLayoutHeader>
      <AppLayoutBody>
        <MessageTemplatesView />
      </AppLayoutBody>
      <AppNavMenuDefault active={AppNavMenuItens.messageTemplates} />
    </AppLayout>
  );
}