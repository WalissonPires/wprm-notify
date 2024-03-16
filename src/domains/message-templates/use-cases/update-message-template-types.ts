import z from "zod";
import { messages } from "@/common/validation/messages";
import { MessageTemplateParam, MessageTemplateParamType } from "../entities";

export interface UpdateMessageTemplateInput {
  messageTemplate: {
    id: string;
    name: string;
    content: string;
    notifyDaysBefore?: number;
    params?: MessageTemplateParam[];
  }
}

export const updateMessageTemplateInputSchema = z.object({
  messageTemplate: z.object({
    name: z.string().max(100).min(1, { message: messages.required }),
    content: z.string().max(2000).min(3),
    notifyDaysBefore: z.number().gt(0).optional(),
    params: z.array(z.object({
      type: z.nativeEnum(MessageTemplateParamType),
      name: z.string().max(50),
      value: z.string()
    })).optional()
  })
});