import { AppLayout } from "@/components/AppLayout";
import { AppLayoutBackWithTitle } from "@/components/AppLayout/BackWithTitle";
import { AppLayoutHeader } from "@/components/AppLayout/Header";
import { AppLayoutBody } from "@/components/AppLayout/Body";
import { AppNavMenuDefault, AppNavMenuItens } from "@/components/AppLayout/NavMenu";
import { ValidationInit } from "@/components/ValidationInit";
import { ContactView } from "@/components/ContactView";

export default function NewContact() {

  return (
    <AppLayout>
      <AppLayoutHeader>
        <AppLayoutBackWithTitle title="Novo contato" />
      </AppLayoutHeader>
      <AppLayoutBody>
        <ValidationInit />
        <ContactView />
      </AppLayoutBody>
      <AppNavMenuDefault active={AppNavMenuItens.contacts} />
    </AppLayout>
  )
}