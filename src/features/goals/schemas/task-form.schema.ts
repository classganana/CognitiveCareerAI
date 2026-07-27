import { z } from "zod";

export const taskFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  dueDate: z.string().optional(),
  completed: z.boolean(),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
