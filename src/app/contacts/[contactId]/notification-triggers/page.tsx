import { PlusIcon } from '@heroicons/react/24/outline';
import { AppLayout } from '@/components/AppLayout';
import { AppLayoutBody } from '@/components/AppLayout/Body';
import { AppLayoutHeader } from '@/components/AppLayout/Header';
import { AppLayoutTabItem } from '@/components/AppLayout/TabItem';
import { AppLayoutTabs } from '@/components/AppLayout/Tabs';
import { AppLayoutPreLoading } from '@/components/AppLayout/PreLoading';
import { AppLayoutBackWithContactTitle } from '@/components/AppLayout/BackWithTitle/WithContact';
import { AppLayoutAction, AppLayoutActions } from '@/components/AppLayout/Actions';
import { AppNavMenuDefault, AppNavMenuItens } from '@/components/AppLayout/NavMenu';
import { AppLoading } from '@/components/AppLayout/Loading';
import ContactNotificationTriggersView from '@/components/ContactNotificationTriggersView';
import { AppRoutes } from '@/common/routes';

export default function ContactNotifications({ params }: PageProps) {

  return (
    <AppLayout>
      <AppLayoutHeader>
        <AppLayoutBackWithContactTitle contactId={params.contactId} />
        <AppLayoutActions>
          <AppLayoutAction title="Criar notificação" href={AppRoutes.newContactNotification(params.contactId)}><PlusIcon className="h-5 w-5"></PlusIcon></AppLayoutAction>
        </AppLayoutActions>
      </AppLayoutHeader>
      <AppLayoutTabs>
      <AppLayoutTabItem label="Mensagens agendadas" title="Mensagens agendadas para envio" href={AppRoutes.contactNotificationTriggers(params.contactId)} replace active />
        <AppLayoutTabItem label="Notificações" title="Notificações pendentes e enviadas" href={AppRoutes.contactNotifications(params.contactId)} replace />
      </AppLayoutTabs>
      <AppLayoutBody>
        <AppLayoutPreLoading>
          <AppLoading />
          <ContactNotificationTriggersView contactId={params.contactId} />
        </AppLayoutPreLoading>
      </AppLayoutBody>
      <AppNavMenuDefault active={AppNavMenuItens.contacts} />
    </AppLayout>
  );
}

interface PageProps {
  params: {
    contactId: string;
  }
}