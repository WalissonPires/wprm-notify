import { PrismaClient } from "@prisma/client";
import { UseCase } from "@/common/use-cases";
import { IdGenerator } from "@/common/identity/generate";
import { UserLogged } from "@/common/auth/user";
import { AppError } from "@/common/error";
import { MessageTemplate } from "../entities";
import { CreateMessateTemplateInput } from "./create-message-template-types";


export class CreateMessageTemplate implements UseCase<CreateMessateTemplateInput, MessageTemplate> {

  private _user: UserLogged;
  private _db: PrismaClient;

  constructor({ userLogged, prismaClient }: { userLogged: UserLogged, prismaClient: PrismaClient }) {

    this._user = userLogged;
    this._db = prismaClient;
  }

  public async execute(input: CreateMessateTemplateInput): Promise<MessageTemplate> {

    const messageTemplate = new MessageTemplate({
      id: new IdGenerator().new(),
      name: input.messageTemplate.name,
      content: input.messageTemplate.content,
      notifyDaysBefore: input.messageTemplate.notifyDaysBefore ?? null,
      params: []
    });

    messageTemplate.fillParamsFromContent();

    const messageTemplateExists = await this._db.templateMessage.findFirst({
      where: {
        accountId: this._user.accountId,
        name: input.messageTemplate.name
      },
      select: {
        id: true
      }
    });

    if (messageTemplateExists)
      throw new AppError('Existe um modelo com esse nome');

    await this._db.templateMessage.create({
      data: {
        id: messageTemplate.id,
        accountId: this._user.accountId,
        name: messageTemplate.name,
        content: messageTemplate.content,
        notifyDaysBefore: messageTemplate.notifyDaysBefore,
        params: JSON.stringify(messageTemplate.params)
      }
    });

    return messageTemplate;
  }
}