import { AppLayout } from "@/components/AppLayout";
import { AppLayoutBackWithTitle } from "@/components/AppLayout/BackWithTitle";
import { AppLayoutHeader } from "@/components/AppLayout/Header";
import { AppLayoutBody } from "@/components/AppLayout/Body";
import { AppLayoutPreLoading } from "@/components/AppLayout/PreLoading";
import { AppNavMenuDefault, AppNavMenuItens } from "@/components/AppLayout/NavMenu";
import { ValidationInit } from "@/components/ValidationInit";
import { ContactImportView } from "@/components/ContactImportView";
import { AppLoading } from '@/components/AppLayout/Loading';

export default function ImportContacts() {

  return (
    <AppLayout>
      <AppLayoutHeader>
        <AppLayoutBackWithTitle title="Importar contatos" />
      </AppLayoutHeader>
      <AppLayoutBody>
        <AppLayoutPreLoading>
          <AppLoading />
          <ValidationInit />
          <ContactImportView />
        </AppLayoutPreLoading>
      </AppLayoutBody>
      <AppNavMenuDefault active={AppNavMenuItens.contacts} />
    </AppLayout>
  )
}