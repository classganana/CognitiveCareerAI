import { z } from "zod";

import {
  RECOMMENDATION_PRIORITIES,
  RECOMMENDATION_STATUSES,
  RecommendationStatus,
} from "@/types/domain/recommendation";
import { GoalPriority } from "@/types/domain/goal";

export const recommendationFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  priority: z.enum(
    RECOMMENDATION_PRIORITIES as [GoalPriority, ...GoalPriority[]],
  ),
  status: z.enum(
    RECOMMENDATION_STATUSES as [RecommendationStatus, ...RecommendationStatus[]],
  ),
  capabilityId: z.string().optional(),
  goalId: z.string().optional(),
});

export type RecommendationFormValues = z.infer<typeof recommendationFormSchema>;
