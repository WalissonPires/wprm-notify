import { AppLayout } from "@/components/AppLayout";
import { AppLayoutBackWithContactTitle } from "@/components/AppLayout/BackWithTitle/WithContact";
import { AppLayoutHeader } from "@/components/AppLayout/Header";
import { AppLayoutBody } from "@/components/AppLayout/Body";
import { AppNavMenuDefault, AppNavMenuItens } from "@/components/AppLayout/NavMenu";
import { ValidationInit } from "@/components/ValidationInit";
import { NotificationView } from "@/components/NotificationView";

export default function NewContactNotification({ params }: PageProps) {

  return (
    <AppLayout>
      <AppLayoutHeader>
      <AppLayoutBackWithContactTitle contactId={params.contactId} />
      </AppLayoutHeader>
      <AppLayoutBody>
        <ValidationInit />
        <NotificationView contactId={params.contactId} />
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