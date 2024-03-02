import z from "zod";
import { PrismaClient } from "@prisma/client";
import { UserLogged } from "@/common/auth/user";
import { messages } from "@/common/validation/messages";
import { AppError } from "@/common/error";
import { Contact } from "../entities";

export class ContactValidation {

  private _user: UserLogged;
  private _db: PrismaClient;
  private _details: Record<keyof Contact, string[]> = {} as any;
  private _validations: ValidationFn[] = [];
  private _contact: ContactModel | null = null;

  constructor({ userLogged, prismaClient }: { userLogged: UserLogged, prismaClient: PrismaClient }) {

    this._user = userLogged;
    this._db = prismaClient;
  }

  public setContactExisting(contact: ContactModel | null) {

    this._contact = contact;
    return this;
  }


  public existsPhone(phone: string | undefined): ContactValidation {

    if (!phone)
      return this;

    this._validations.push(async() => {

      const contactExists = await this._db.contact.findFirst({
        where: {
          accountId: this._user.accountId,
          phone: phone
        },
        select: { id: true }
      });

      if (contactExists && (this._contact?.id !== contactExists.id))
        this._details.phone = ['Já existe um contato com esse telefone'];
    });

    return this;
  }

  public existsEmail(email: string | undefined): ContactValidation {

    if (!email)
      return this;

    this._validations.push(async() => {
      const contactExists = await this._db.contact.findFirst({
        where: {
          accountId: this._user.accountId,
          email: email
        },
        select: { id: true }
      });

      if (contactExists && (this._contact?.id !== contactExists.id))
        this._details.email = ['Já existe um contato com esse email'];
  });

    return this;
  }

  public async validate() {

    for(const validation of this._validations) {

      await validation();
    }

    return this;
  }

  public getValidation() {

    return this._details;
  }

  public haErrors() {

    return Object.keys(this._details).length > 0;
  }

  public throwIfInvalid() {

    if (this.haErrors())
      throw new AppError(AppError.invalidFieldsMessage, { details: this._details });
  }
}

export const contactInputSchema = z.object({
    name: z.string().max(40).min(1, { message: messages.required }),
    phone: z.string().max(11).min(10).regex(/\d{10,11}/, 'Telefone inválido').optional(),
    email: z.string().email().max(60).optional(),
    groupsId: z.array(z.string()).min(1)
  })
  .refine(c => c.phone || c.email, { message: 'O telefone ou email deve ser informado' });

type ValidationFn = () => Promise<void>;
type ContactModel = Pick<Contact, 'id'>;