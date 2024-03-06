import { AppLayout } from "@/components/AppLayout";
import { AppLayoutBackWithTitle } from "@/components/AppLayout/BackWithTitle";
import { AppLayoutHeader } from "@/components/AppLayout/Header";
import { AppLayoutBody } from "@/components/AppLayout/Body";
import { AppLayoutPreLoading } from "@/components/AppLayout/PreLoading";
import { AppNavMenuDefault, AppNavMenuItens } from "@/components/AppLayout/NavMenu";
import { ValidationInit } from "@/components/ValidationInit";
import { MessageTemplateView } from "@/components/MessageTemplateView";

export default function NewMessageTemplate({ params }: PageProps) {

  return (
    <AppLayout>
      <AppLayoutHeader>
        <AppLayoutBackWithTitle title="Editar modelo de mensagem" />
      </AppLayoutHeader>
      <AppLayoutBody>
        <AppLayoutPreLoading>
          <ValidationInit />
          <MessageTemplateView messateTemplateId={params.messageTemplateId} />
        </AppLayoutPreLoading>
      </AppLayoutBody>
      <AppNavMenuDefault active={AppNavMenuItens.messageTemplates} />
    </AppLayout>
  )
}


interface PageProps {
  params: {
    messageTemplateId: string;
  }
}