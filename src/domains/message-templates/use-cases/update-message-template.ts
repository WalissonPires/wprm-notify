import { PrismaClient, TemplateMessageParamType } from "@prisma/client";
import { UserLogged } from "@/common/auth/user";
import { UseCase } from "@/common/use-cases";
import { AppError } from "@/common/error";
import { IdGenerator } from "@/common/identity/generate";
import { UpdateMessageTemplateInput } from "./update-message-template-types";
import { MessageTemplate, MessageTemplateParamType } from "../entities";


export class UpdateMessageTemplate implements UseCase<UpdateMessageTemplateInput, MessageTemplate> {

  private _user: UserLogged;
  private _db: PrismaClient;

  constructor({ userLogged, prismaClient }: { userLogged: UserLogged, prismaClient: PrismaClient }) {

    this._user = userLogged;
    this._db = prismaClient;
  }


  public async execute(input: UpdateMessageTemplateInput): Promise<MessageTemplate> {

    const idGen = new IdGenerator();

    const messageTemplate = new MessageTemplate({
      id: input.messageTemplate.id,
      name: input.messageTemplate.name,
      content: input.messageTemplate.content,
      notifyDaysBefore: input.messageTemplate.notifyDaysBefore ?? null,
      params: input.messageTemplate.params?.filter(x => x.type !== MessageTemplateParamType.Text) ?? []
    });

    messageTemplate.fillParamsFromContent();

    const messageTemplateExists = await this._db.templateMessage.findFirst({
      where: {
        id: {
          not: {
            equals: input.messageTemplate.id,
          }
        },
        accountId: this._user.accountId,
        name: input.messageTemplate.name
      },
      select: {
        id: true
      }
    });

    if (messageTemplateExists)
      throw new AppError('Existe um modelo com esse nome');

    const currentParams = await this._db.templateMessageParam.findMany({
      where: {
        templateMessageId: input.messageTemplate.id
      }
    });

    for(const paramDb of currentParams) {

      if (paramDb.type !== TemplateMessageParamType.File)
        continue;

      const inputParam = messageTemplate.params.find(p => p.name == paramDb.name);

      if (inputParam &&  !inputParam.value)
        inputParam.value = paramDb.value;
    }

    await this._db.templateMessage.update({
      where: {
        id: input.messageTemplate.id,
        accountId: this._user.accountId
      },
      data: {
        id: messageTemplate.id,
        accountId: this._user.accountId,
        name: messageTemplate.name,
        content: messageTemplate.content,
        notifyDaysBefore: messageTemplate.notifyDaysBefore,
        params: {
          deleteMany: { id: { not: '' } },
          create: messageTemplate.params.map(p => ({
            id: idGen.new(),
            name: p.name,
            type: p.type,
            value: p.value
          }))
        }
      }
    });

    return messageTemplate;
  }

}