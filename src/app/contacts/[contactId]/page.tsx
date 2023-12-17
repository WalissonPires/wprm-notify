import { AppLayout } from "@/components/AppLayout";
import { AppLayoutHeader } from "@/components/AppLayout/Header";
import { AppLayoutBackWithContactTitle } from "@/components/AppLayout/BackWithTitle/WithContact";
import { AppLayoutBody } from "@/components/AppLayout/Body";
import { AppNavMenuDefault, AppNavMenuItens } from "@/components/AppLayout/NavMenu";
import { ValidationInit } from "@/components/ValidationInit";
import { ContactView } from "@/components/ContactView";

export default function EditContact({ params }: PageProps) {

  return (
    <AppLayout>
      <AppLayoutHeader>
        <AppLayoutBackWithContactTitle contactId={params.contactId} />
      </AppLayoutHeader>
      <AppLayoutBody>
        <ValidationInit />
        <ContactView contactId={params.contactId} />
      </AppLayoutBody>
      <AppNavMenuDefault active={AppNavMenuItens.contacts} />
    </AppLayout>
  )
}

interface PageProps {
  params: {
    contactId: string;
  }
}