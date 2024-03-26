import { PrismaClient } from "@prisma/client";
import { UseCase } from "@/common/use-cases";
import { IdGenerator } from "@/common/identity/generate";
import { UserLogged } from "@/common/auth/user";
import { AppError } from "@/common/error";
import { MessageTemplate, MessageTemplateParamType } from "../entities";
import { CreateMessageTemplateInput } from "./create-message-template-types";


export class CreateMessageTemplate implements UseCase<CreateMessageTemplateInput, MessageTemplate> {

  private _user: UserLogged;
  private _db: PrismaClient;

  constructor({ userLogged, prismaClient }: { userLogged: UserLogged, prismaClient: PrismaClient }) {

    this._user = userLogged;
    this._db = prismaClient;
  }

  public async execute(input: CreateMessageTemplateInput): Promise<MessageTemplate> {

    const idGen = new IdGenerator();

    const messageTemplate = new MessageTemplate({
      id: idGen.new(),
      name: input.messageTemplate.name,
      content: input.messageTemplate.content,
      notifyDaysBefore: input.messageTemplate.notifyDaysBefore ?? null,
      params: input.messageTemplate.params?.filter(x => x.type !== MessageTemplateParamType.Text) ?? []
    });

    messageTemplate.fillParamsFromContent();

    const messageTemplateExists = await this._db.templateMessage.findFirst({
      where: {
        accountId: this._user.accountId,
        name: {
          equals: input.messageTemplate.name,
          mode: 'insensitive'
        }
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
        params: {
          create: messageTemplate.params.map(p => ({
            id: idGen.new(),
            type: p.type,
            name: p.name,
            value: p.value ?? ''
          }))
        }
      }
    });

    return messageTemplate;
  }
}