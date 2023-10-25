import { PrismaClient } from "@prisma/client";
import { UseCase } from "@/common/use-cases";
import { UserLogged } from "@/common/auth/user";
import { Contact } from "../entities";
import { ContactMapper } from "../mapper";


export class GetContactById implements UseCase<GetContactByIdInput, Contact | null> {

  private _db: PrismaClient;
  private _user: UserLogged;

  constructor({ userLogged, prismaClient }: { userLogged: UserLogged, prismaClient: PrismaClient }) {

    this._user = userLogged;
    this._db = prismaClient;
  }

  public async execute(input: GetContactByIdInput): Promise<Contact | null> {

    const contactDb =  await this._db.contact.findFirst({
      where: {
        id: input.contactId,
        accountId: this._user.accountId
      },
      include: {
        groups: {
          include: {
            group: true
          }
        }
      }
    });

    if (!contactDb) return null;

    const contactMapper = new ContactMapper();
    const contact = contactMapper.mapFromDb(contactDb);

    return contact;
  }

}

export interface GetContactByIdInput {
  contactId: string;
}