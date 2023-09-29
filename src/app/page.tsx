import { AppLayout } from '../components/AppLayout';
import { AppLayoutBody } from '../components/AppLayout/Body';
import { AppLayoutHeader } from '../components/AppLayout/Header';
import { AppLayoutMenuWithTitle } from '../components/AppLayout/MenuWithTitle';
import { AppLayoutTabItem } from '../components/AppLayout/TabItem';
import { AppLayoutTabs } from '../components/AppLayout/Tabs';
import ContactsContainer from '../components/ContactsContainer';

export default function Home() {

  return (
    <AppLayout>
      <AppLayoutHeader>
        <AppLayoutMenuWithTitle />
      </AppLayoutHeader>
      <AppLayoutTabs>
        <AppLayoutTabItem label="Contatos" title="Contatos" href="/" active />
        <AppLayoutTabItem label="Eventos" title="Eventos" href="/events" />
        <AppLayoutTabItem label="Mensagens" title="Mensagens" href="/template-messages" />
      </AppLayoutTabs>
      <AppLayoutBody>
        <ContactsContainer />
      </AppLayoutBody>
    </AppLayout>
  );
}