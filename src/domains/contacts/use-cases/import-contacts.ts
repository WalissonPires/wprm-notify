import { PrismaClient } from "@prisma/client";
import { UseCase } from "@/common/use-cases";
import { UserLogged } from "@/common/auth/user";
import { IdGenerator } from "@/common/identity/generate";
import { AppError } from "@/common/error";
import { ContactValidation, contactInputSchema } from "./contact-validation";
import { ImportContactsInput, ImportContactsResult } from "./import-contacts-types";


export class ImportContacts implements UseCase<ImportContactsInput, ImportContactsResult> {

  private _user: UserLogged;
  private _db: PrismaClient;
  private _contactValidation: ContactValidation;

  constructor({ userLogged, prismaClient, contactValidation }: { userLogged: UserLogged, prismaClient: PrismaClient, contactValidation: ContactValidation }) {

    this._user = userLogged;
    this._db = prismaClient;
    this._contactValidation = contactValidation;
  }

  public async execute(input: ImportContactsInput): Promise<ImportContactsResult> {

    const idGenerator = new IdGenerator();
    const contacts = input.contacts;

    const result: ImportContactsResult = {
      contacts: []
    };

    for(let i = 0; i < contacts.length; i++) {

      const contact = contacts[i];

      const valResult = contactInputSchema.safeParse(contact);
      if (!valResult.success) {

        const errors = AppError.fromZodError(valResult.error);

        result.contacts.push({
          success: false,
          errors: Object.keys(errors.details).reduce((list, key) => list.concat((errors.details)[key]), [] as string[])
        });

        continue;
      }

      const validation = await this._contactValidation
        .existsPhone(contact.phone)
        .existsEmail(contact.email)
        .validate();

      if (validation.haErrors()) {

        const errors = validation.getValidation();

        result.contacts.push({
          success: false,
          errors: Object.keys(errors).reduce((list, key) => list.concat((errors as Record<string, string[]>)[key]), [] as string[])
        });

        continue;
      }

      result.contacts.push({
        success: true
      });
    }

    for(let index = 0; index < contacts.length; index++) {

      const contact = contacts[index];
      const contactResult = result.contacts[index];

      if (!contactResult.success)
        continue;

      try {
        await this._db.contact.create({
          data: {
            accountId: this._user.accountId,
            id: idGenerator.new(),
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
      }
      catch(error) {

        contactResult.success = false;
        contactResult.errors = [ AppError.parse(error).message ];
      }
    }

    return result;
  }
}