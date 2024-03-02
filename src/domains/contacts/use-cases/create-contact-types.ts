import z from "zod";
import { messages } from "@/common/validation/messages";
import { Contact } from "../entities";
import { contactInputSchema } from "./contact-validation";

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
  contact: contactInputSchema
});