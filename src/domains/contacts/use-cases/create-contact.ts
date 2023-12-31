import { PrismaClient } from "@prisma/client";
import { UseCase } from "@/common/use-cases";
import { UserLogged } from "@/common/auth/user";
import { IdGenerator } from "@/common/identity/generate";
import { ContactCreated, CreateContactInput } from "./create-contact-types";
import { ContactValidation } from "./contact-validation";


export class CreateContact implements UseCase<CreateContactInput, ContactCreated> {

  private _user: UserLogged;
  private _db: PrismaClient;
  private _contactValidation: ContactValidation;

  constructor({ userLogged, prismaClient, contactValidation }: { userLogged: UserLogged, prismaClient: PrismaClient, contactValidation: ContactValidation }) {

    this._user = userLogged;
    this._db = prismaClient;
    this._contactValidation = contactValidation;
  }


  public async execute(input: CreateContactInput): Promise<ContactCreated> {

    const contactId = new IdGenerator().new();
    const contact = input.contact;

    (await this._contactValidation
      .existsPhone(contact.phone)
      .existsEmail(contact.email)
      .validate())
      .throwIfInvalid();


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