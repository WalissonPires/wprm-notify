import { AppLayout } from "@/components/AppLayout";
import { AppLayoutBackWithTitle } from "@/components/AppLayout/BackWithTitle";
import { AppLayoutHeader } from "@/components/AppLayout/Header";
import { AppLayoutBody } from "@/components/AppLayout/Body";
import { AppLayoutPreLoading } from "@/components/AppLayout/PreLoading";
import { AppNavMenuDefault, AppNavMenuItens } from "@/components/AppLayout/NavMenu";
import { ValidationInit } from "@/components/ValidationInit";
import { GroupView } from "@/components/GroupView";
import { AppLoading } from "@/components/AppLayout/Loading";

export default function NewGroup() {

  return (
    <AppLayout>
      <AppLayoutHeader>
        <AppLayoutBackWithTitle title="Novo grupo" />
      </AppLayoutHeader>
      <AppLayoutBody>
        <AppLayoutPreLoading>
          <AppLoading />
          <ValidationInit />
          <GroupView />
        </AppLayoutPreLoading>
      </AppLayoutBody>
      <AppNavMenuDefault active={AppNavMenuItens.more} />
    </AppLayout>
  )
}