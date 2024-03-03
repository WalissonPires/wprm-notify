import z from "zod";
import { messages } from "@/common/validation/messages";

export interface CreateMessateTemplateInput {
  messageTemplate: {
    name: string;
    content: string;
    notifyDaysBefore?: number;
  }
}

export const createMessateTemplateInputSchema = z.object({
  messageTemplate: z.object({
    name: z.string().max(100).min(1, { message: messages.required }),
    content: z.string().max(2000).min(3),
    notifyDaysBefore: z.number().gt(0).optional()
  })
});