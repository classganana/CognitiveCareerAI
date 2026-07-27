import { z } from "zod";

import { GOAL_PRIORITIES, GOAL_STATUSES, GoalPriority, GoalStatus } from "@/types/domain/goal";

export const goalFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  priority: z.enum(GOAL_PRIORITIES as [GoalPriority, ...GoalPriority[]]),
  status: z.enum(GOAL_STATUSES as [GoalStatus, ...GoalStatus[]]),
  targetDate: z.string().optional(),
});

export type GoalFormValues = z.infer<typeof goalFormSchema>;
