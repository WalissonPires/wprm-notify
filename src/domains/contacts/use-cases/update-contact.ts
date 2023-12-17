import { PrismaClient } from "@prisma/client";
import { UserLogged } from "@/common/auth/user";
import { UseCase } from "@/common/use-cases";
import { UpdateContactInput } from "./update-contact-types";
import { ContactValidation } from "./contact-validation";

export class UpdateContact implements UseCase<UpdateContactInput, void> {

  private _user: UserLogged;
  private _db: PrismaClient;
  private _contactValidation: ContactValidation;

  constructor({ userLogged, prismaClient, contactValidation }: { userLogged: UserLogged, prismaClient: PrismaClient, contactValidation: ContactValidation }) {

    this._user = userLogged;
    this._db = prismaClient;
    this._contactValidation = contactValidation;
  }

  public async execute(input: UpdateContactInput): Promise<void> {

    const contact = input.contact;

    (await this._contactValidation
      .setContactExisting(contact)
      .existsPhone(contact.phone)
      .existsEmail(contact.email)
      .validate())
      .throwIfInvalid();

    await this._db.contact.update({
      where: {
        id: contact.id,
        accountId: this._user.accountId
      },
      data: {
        name: contact.name,
        email: contact.email,
        phone: contact.phone,
        groups: {
          deleteMany: {},
          create: contact.groupsId?.map(groupId => ({
            groupId: groupId
          }))
        }
      }
    });
  }

}