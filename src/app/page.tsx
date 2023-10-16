import { AppLayout } from '@/components/AppLayout';
import { AppLayoutBody } from '@/components/AppLayout/Body';
import { AppLayoutHeader } from '@/components/AppLayout/Header';
import { AppLayoutMenuWithTitle } from '@/components/AppLayout/MenuWithTitle';
import { AppNavMenuDefault, AppNavMenuItens } from '@/components/AppLayout/NavMenu';
import ContactsContainer from '@/components/ContactsContainer';

export default function Home() {

  return (
    <AppLayout>
      <AppLayoutHeader>
        <AppLayoutMenuWithTitle />
      </AppLayoutHeader>
      <AppLayoutBody>
        <ContactsContainer />
      </AppLayoutBody>
      <AppNavMenuDefault active={AppNavMenuItens.contacts} />
    </AppLayout>
  );
}