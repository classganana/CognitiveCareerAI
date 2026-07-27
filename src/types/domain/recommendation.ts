import type { Types } from "mongoose";

import type { BaseEntity } from "./base";
import { GoalPriority } from "./goal";

export enum RecommendationStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export const RECOMMENDATION_STATUSES = Object.values(RecommendationStatus);
export const RECOMMENDATION_PRIORITIES = Object.values(GoalPriority);

export interface Recommendation extends BaseEntity {
  careerCaseId: Types.ObjectId;
  title: string;
  description: string;
  status: RecommendationStatus;
  priority: GoalPriority;
  capabilityId?: Types.ObjectId;
  goalId?: Types.ObjectId;
}

export type CreateRecommendationInput = Pick<
  Recommendation,
  "careerCaseId" | "title" | "description" | "priority"
> &
  Partial<Pick<Recommendation, "status" | "capabilityId" | "goalId">>;

export type UpdateRecommendationInput = Partial<CreateRecommendationInput>;

export type RecommendationReference = Types.ObjectId | Recommendation;
