import z from "zod";
import { messages } from "@/common/validation/messages";

export interface SendMessageInput {
  groupsId?: string[];
  contactsId?: string[];
  message: {
    content: string;
    medias?: Media[];
  }
}

export interface Media {
  mimeType: string;
  fileBase64: string;
  label?: string;
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
    content: z.string().min(1, messages.required).max(2000),
    medias: z.array(z.object({
      mimeType: z.string().max(40),
      fileBase64: z.string().max(10_000),
      label: z.string().max(100).optional()
    })).optional()
  })
}).refine(({ groupsId, contactsId }) => groupsId?.length! > 0 || contactsId?.length! > 0, {
  message: 'Informe o id dos grupos ou contatos'
});