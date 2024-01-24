import { AppLayout } from "@/components/AppLayout";
import { AppLayoutHeader } from "@/components/AppLayout/Header";
import { AppLayoutBackWithContactTitle } from "@/components/AppLayout/BackWithTitle/WithContact";
import { AppLayoutBody } from "@/components/AppLayout/Body";
import { AppLayoutPreLoading } from "@/components/AppLayout/PreLoading";
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
        <AppLayoutPreLoading>
          <ValidationInit />
          <ContactView contactId={params.contactId} />
        </AppLayoutPreLoading>
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