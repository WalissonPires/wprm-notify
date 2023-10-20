import { AppLayout } from "@/components/AppLayout";
import { AppLayoutBackWithTitle } from "@/components/AppLayout/BackWithTitle";
import { AppLayoutHeader } from "@/components/AppLayout/Header";
import { AppLayoutBody } from "@/components/AppLayout/Body";
import { AppNavMenuDefault, AppNavMenuItens } from "@/components/AppLayout/NavMenu";
import { ValidationInit } from "@/components/ValidationInit";
import { MessageTemplateView } from "@/components/MessageTemplateView";

export default function NewMessageTemplate() {

  return (
    <AppLayout>
      <AppLayoutHeader>
        <AppLayoutBackWithTitle title="Novo modelo de mensagem" />
      </AppLayoutHeader>
      <AppLayoutBody>
        <ValidationInit />
        <MessageTemplateView />
      </AppLayoutBody>
      <AppNavMenuDefault active={AppNavMenuItens.messageTemplates} />
    </AppLayout>
  )
}