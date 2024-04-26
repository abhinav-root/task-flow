import { z } from "zod";

export const createFormSchema = z.object({
  projectName: z.string().min(3).max(20),
  boardName: z.string().min(3).max(20),
});

export type CreateFormSchema = z.infer<typeof createFormSchema>;
