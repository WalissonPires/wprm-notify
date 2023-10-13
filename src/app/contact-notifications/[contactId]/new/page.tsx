import { AppLayout } from "@/components/AppLayout";
import { AppLayoutBackWithTitle } from "@/components/AppLayout/BackWithTitle";
import { AppLayoutHeader } from "@/components/AppLayout/Header";
import { AppLayoutBody } from "@/components/AppLayout/Body";
import { ValidationInit } from "@/components/ValidationInit";
import { NotificationView } from "@/components/NotificationView";

export default function NewContactNotification({ params }: PageProps) {

  return (
    <AppLayout>
      <AppLayoutHeader>
        <AppLayoutBackWithTitle title="Nome do contato" />
      </AppLayoutHeader>
      <AppLayoutBody>
        <ValidationInit />
        <NotificationView contactId={params.contactId} />
      </AppLayoutBody>
    </AppLayout>
  )
}

interface PageProps {
  params: {
    contactId: string;
  }
}