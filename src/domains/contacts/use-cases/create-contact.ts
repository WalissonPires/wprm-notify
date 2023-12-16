import { PrismaClient } from "@prisma/client";
import { UseCase } from "@/common/use-cases";
import { UserLogged } from "@/common/auth/user";
import { IdGenerator } from "@/common/identity/generate";
import { AppError } from "@/common/error";
import { ContactCreated, CreateContactInput } from "./create-contact-types";


export class CreateContact implements UseCase<CreateContactInput, ContactCreated> {

  private _user: UserLogged;
  private _db: PrismaClient;

  constructor({ userLogged, prismaClient }: { userLogged: UserLogged, prismaClient: PrismaClient }) {

    this._user = userLogged;
    this._db = prismaClient;
  }


  public async execute(input: CreateContactInput): Promise<ContactCreated> {

    const contactId = new IdGenerator().new();
    const contact = input.contact;

    const contactPhoneExists = contact.phone ? await this._db.contact.findFirst({
      where: {
        accountId: this._user.accountId,
        phone: contact.phone
      },
      select: { id: true }
    }) : undefined;

    const contactEmailExists = contact.email ? await this._db.contact.findFirst({
      where: {
        accountId: this._user.accountId,
        email: contact.email
      },
      select: { id: true }
    }) : undefined;

    const details: Record<keyof CreateContactInput['contact'], string[]> = {} as any;

    if (contactPhoneExists)
      details.phone = [ 'Já existe um contato com esse telefone' ];

    if (contactEmailExists)
      details.phone = [ 'Já existe um contato com esse email' ];

    if (Object.keys(details).length > 0)
      throw new AppError(AppError.invalidFieldsMessage, details);

    await this._db.contact.create({
      data: {
        accountId: this._user.accountId,
        id: contactId,
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        createdAt: new Date(),
        updatedAt: new Date(),
        groups: {
          create: contact.groupsId?.map(groupId => ({
            groupId: groupId
          }))
        }
      }
    });

    return {
      id: contactId
    }
  }
}