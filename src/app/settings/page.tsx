import { AppLayout } from '@/components/AppLayout';
import { AppLayoutBody } from '@/components/AppLayout/Body';
import { AppLayoutHeader } from '@/components/AppLayout/Header';
import { AppLayoutMenuWithTitle } from '@/components/AppLayout/MenuWithTitle';
import { AppNavMenuDefault, AppNavMenuItens } from '@/components/AppLayout/NavMenu';
import { SettingsView } from '@/components/SettingsView';
import { AppLayoutPreLoading } from '@/components/AppLayout/PreLoading';

export default function Settings() {

  return (
    <AppLayout>
      <AppLayoutHeader>
        <AppLayoutMenuWithTitle title="Configurações" />
      </AppLayoutHeader>
      <AppLayoutBody>
        <AppLayoutPreLoading>
          <SettingsView />
        </AppLayoutPreLoading>
      </AppLayoutBody>
      <AppNavMenuDefault active={AppNavMenuItens.more} />
    </AppLayout>
  );
}