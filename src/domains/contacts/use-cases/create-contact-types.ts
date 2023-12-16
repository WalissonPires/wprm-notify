import z from "zod";
import { messages } from "@/common/validation/messages";
import { Contact } from "../entities";

export interface CreateContactInput {
  contact: {
    name: string;
    phone?: string;
    email?: string;
    groupsId: string[];
  }
}

export type ContactCreated = Pick<Contact, 'id'>;

export const createContactInputSchema = z.object({
  contact: z.object({
    name: z.string().max(40).min(1, { message: messages.required }),
    phone: z.string().max(11).min(11).optional(),
    email: z.string().email().max(60).optional(),
    groupsId: z.array(z.string()).min(1)
  })
  .refine(c => c.phone || c.email, { message: 'O telefone ou email deve ser informado' })
});