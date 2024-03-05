import { TemplateMessage as MessageTemplateDb } from "@prisma/client";
import { MessageTemplate, MessageTemplate1 } from "./entities";


export class MessageTemplateMapper {

  public map(templateDb: MessageTemplateDb): MessageTemplate {

    const template = new MessageTemplate({
      id: templateDb.id,
      name: templateDb.name,
      content: templateDb.content,
      notifyDaysBefore: templateDb.notifyDaysBefore,
      params: templateDb.params ? JSON.parse(templateDb.params) : []
    });

    return template;
  }

  public mapToView1(templateDb: MessageTemplateDb): MessageTemplate1 {

    const template: MessageTemplate1 = {
      id: templateDb.id,
      name: templateDb.name,
      content: templateDb.content,
      params: templateDb.params ? JSON.parse(templateDb.params) : []
    };

    return template;
  }
}