import { AppLayout } from "@/components/AppLayout";
import { AppLayoutBackWithTitle } from "@/components/AppLayout/BackWithTitle";
import { AppLayoutHeader } from "@/components/AppLayout/Header";
import { AppLayoutBody } from "@/components/AppLayout/Body";
import { AppLayoutPreLoading } from "@/components/AppLayout/PreLoading";
import { AppNavMenuDefault, AppNavMenuItens } from "@/components/AppLayout/NavMenu";
import { ValidationInit } from "@/components/ValidationInit";
import { MessageTemplateView } from "@/components/MessageTemplateView";
import { AppLoading } from "@/components/AppLayout/Loading";

export default function NewMessageTemplate() {

  return (
    <AppLayout>
      <AppLayoutHeader>
        <AppLayoutBackWithTitle title="Novo modelo de mensagem" />
      </AppLayoutHeader>
      <AppLayoutBody>
        <AppLayoutPreLoading>
          <AppLoading />
          <ValidationInit />
          <MessageTemplateView />
        </AppLayoutPreLoading>
      </AppLayoutBody>
      <AppNavMenuDefault active={AppNavMenuItens.messageTemplates} />
    </AppLayout>
  )
}