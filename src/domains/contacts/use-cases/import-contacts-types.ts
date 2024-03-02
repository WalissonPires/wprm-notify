import z, { object } from "zod";

export interface ImportContactsInput {
  contacts: {
    name: string;
    phone?: string;
    email?: string;
    groupsId: string[];
  }[]
}

export interface ImportContactsResult {
  contacts: {
    success: boolean;
    errors?: string[];
  }[]
}

export const importContactInputSchema = z.object({
  contacts: z.array(z.object({
    name: z.string(),
    phone: z.string().optional(),
    email: z.string().optional(),
    groupsId: z.array(z.string())
  }))
});