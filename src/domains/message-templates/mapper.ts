import { TemplateMessage as MessageTemplateDb } from "@prisma/client";
import { MessageTemplate } from "./entities";


export class MessageTemplateMapper {

  public map(templateDb: MessageTemplateDb): MessageTemplate {

    const template = new MessageTemplate({
      content: templateDb.content,
      params: templateDb.params ? JSON.parse(templateDb.params) : {}
    });

    return template;
  }
}