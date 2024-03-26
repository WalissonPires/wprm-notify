import z from "zod";
import { messages } from "@/common/validation/messages";

export interface UpdateGroupInput {
  group: {
    id: string;
    name: string;
    color: string;
  }
}

export const updateGroupInputSchema = z.object({
  group: z.object({
    name: z.string().max(30).min(1, { message: messages.required }),
    color: z.string().max(7).min(1, { message: messages.required }),
  })
});