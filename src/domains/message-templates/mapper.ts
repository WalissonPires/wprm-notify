import { TemplateMessage as TemplateMessageDb, TemplateMessageParam as TemplateMessageParamDb } from "@prisma/client";
import { MessageTemplate, MessageTemplate1, MessageTemplateParamType } from "./entities";


export class MessageTemplateMapper {

  public map(templateDb: MessageTemplateWithParamsDb): MessageTemplate {

    const template = new MessageTemplate({
      id: templateDb.id,
      name: templateDb.name,
      content: templateDb.content,
      notifyDaysBefore: templateDb.notifyDaysBefore,
      params: templateDb.params?.map(p => ({
        name: p.name,
        type: p.type as MessageTemplateParamType,
        value: p.value ?? null
      })) ?? []
    });

    return template;
  }

  public mapToView1(templateDb: MessageTemplateWithParamsDb): MessageTemplate1 {

    const template: MessageTemplate1 = {
      id: templateDb.id,
      name: templateDb.name,
      content: templateDb.content,
      notifyDaysBefore: templateDb.notifyDaysBefore,
      params: templateDb.params?.map(p => ({
        name: p.name,
        type: p.type as MessageTemplateParamType,
        value: p.value ?? null
      })) ?? []
    };

    return template;
  }
}

type MessageTemplateWithParamsDb = TemplateMessageDb & {
  params: (Pick<TemplateMessageParamDb, 'type' | 'name'> & Pick<Partial<TemplateMessageParamDb>, 'value'>)[]
}