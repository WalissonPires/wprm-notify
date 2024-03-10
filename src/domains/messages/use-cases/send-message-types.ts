import z from "zod";
import { messages } from "@/common/validation/messages";

export interface SendMessageInput {
  groupsId?: string[];
  contactsId?: string[];
  message: {
    content: string;
  }
}

export interface SendMessageResult {
  contacts: {
    id: string;
    name: string;
    isSended: boolean;
    errorMessage: string | null;
  }[];
}

export const sendMessageInputSchema = z.object({
  groupsId: z.array(z.string()).optional(),
  contactsId: z.array(z.string()).optional(),
  message: z.object({
    content: z.string().min(1, messages.required).max(2000)
  })
}).refine(({ groupsId, contactsId }) => groupsId?.length! > 0 || contactsId?.length! > 0, {
  message: 'Informe o id dos grupos ou contatos'
});