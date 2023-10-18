import { AppLayout } from '@/components/AppLayout';
import { AppLayoutBody } from '@/components/AppLayout/Body';
import { AppLayoutHeader } from '@/components/AppLayout/Header';
import { AppLayoutMenuWithTitle } from '@/components/AppLayout/MenuWithTitle';
import { AppNavMenuDefault, AppNavMenuItens } from '@/components/AppLayout/NavMenu';
import ContactNotificationsView from '@/components/ContactNotificationsView';

export default function Notifications() {

  return (
    <AppLayout>
      <AppLayoutHeader>
        <AppLayoutMenuWithTitle title="Notificações" />
      </AppLayoutHeader>
      <AppLayoutBody>
        <ContactNotificationsView />
      </AppLayoutBody>
      <AppNavMenuDefault active={AppNavMenuItens.notifications} />
    </AppLayout>
  );
}