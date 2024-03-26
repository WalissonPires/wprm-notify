import { PlusIcon } from '@heroicons/react/24/outline';
import { AppLayout } from '@/components/AppLayout';
import { AppLayoutBody } from '@/components/AppLayout/Body';
import { AppLayoutPreLoading } from '@/components/AppLayout/PreLoading';
import { AppLayoutHeader } from '@/components/AppLayout/Header';
import { AppLayoutMenuWithTitle } from '@/components/AppLayout/MenuWithTitle';
import { AppNavMenuDefault, AppNavMenuItens } from '@/components/AppLayout/NavMenu';
import { AppLayoutAction, AppLayoutActions } from '@/components/AppLayout/Actions';
import { AppRoutes } from '@/common/routes';
import { AppLoading } from '@/components/AppLayout/Loading';
import { ModalContainer } from '@/components/Modal/Container';
import GroupsView from '@/components/GroupsView';

export default function Groups() {

  return (
    <AppLayout>
      <AppLayoutHeader>
        <AppLayoutMenuWithTitle title="Grupos" />
        <AppLayoutActions>
          <AppLayoutAction title="Criar grupo" href={AppRoutes.newGroup()}><PlusIcon className="h-5 w-5"></PlusIcon></AppLayoutAction>
        </AppLayoutActions>
      </AppLayoutHeader>
      <AppLayoutBody>
        <AppLayoutPreLoading>
          <AppLoading />
          <GroupsView />
        </AppLayoutPreLoading>
      </AppLayoutBody>
      <AppNavMenuDefault active={AppNavMenuItens.more} />
      <ModalContainer />
    </AppLayout>
  );
}