import z from "zod";
import { messages } from "@/common/validation/messages";

export interface CreateGroupInput {
  group: {
    name: string;
    color: string;
  }
}

export const createGroupInputSchema = z.object({
  group: z.object({
    name: z.string().max(30).min(1, { message: messages.required }),
    color: z.string().max(7).min(1, { message: messages.required }),
  })
});