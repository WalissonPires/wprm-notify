import { ArrowUpOnSquareIcon, PlusIcon, PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { AppLayout } from '@/components/AppLayout';
import { AppLayoutBody } from '@/components/AppLayout/Body';
import { AppLayoutHeader } from '@/components/AppLayout/Header';
import { AppLayoutMenuWithTitle } from '@/components/AppLayout/MenuWithTitle';
import { AppNavMenuDefault, AppNavMenuItens } from '@/components/AppLayout/NavMenu';
import { AppLayoutAction, AppLayoutActions } from '@/components/AppLayout/Actions';
import { SearchAction } from '@/components/AppLayout/Actions/SearchAction';
import ContactsContainer from '@/components/ContactsContainer';
import { ContactsFilterAction } from '@/components/ContactsView/ContactsFilter';
import { AppRoutes } from '../common/routes';
import { AppLayoutPreLoading } from '@/components/AppLayout/PreLoading';

export default function Home() {

  return (
    <AppLayout>
      <AppLayoutHeader>
        <AppLayoutMenuWithTitle title="Contatos" />
        <AppLayoutActions>
          <SearchAction placeholder='Nome, telefone ou email' />
          <AppLayoutAction title="Enviar mensagem" href={AppRoutes.message()}><PaperAirplaneIcon className="h-5 w-5" /></AppLayoutAction>
          <AppLayoutAction title="Importar contatos" href={AppRoutes.importContacts()}><ArrowUpOnSquareIcon className="h-5 w-5" /></AppLayoutAction>
          <ContactsFilterAction />
          <AppLayoutAction title="Criar contato" href={AppRoutes.newContact()}><PlusIcon className="h-5 w-5" /></AppLayoutAction>
        </AppLayoutActions>
      </AppLayoutHeader>
      <AppLayoutBody>
        <AppLayoutPreLoading>
          <ContactsContainer />
        </AppLayoutPreLoading>
      </AppLayoutBody>
      <AppNavMenuDefault active={AppNavMenuItens.contacts} />
    </AppLayout>
  );
}