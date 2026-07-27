import type { Types } from "mongoose";

import type { BaseEntity } from "./base";

export enum GoalStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  ON_HOLD = "on_hold",
}

export enum GoalPriority {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export const GOAL_STATUSES = Object.values(GoalStatus);
export const GOAL_PRIORITIES = Object.values(GoalPriority);

export interface Goal extends BaseEntity {
  careerCaseId: Types.ObjectId;
  title: string;
  description: string;
  targetDate?: Date;
  status: GoalStatus;
  priority: GoalPriority;
}

export type CreateGoalInput = Pick<
  Goal,
  "careerCaseId" | "title" | "description" | "status" | "priority"
> &
  Partial<Pick<Goal, "targetDate">>;

export type UpdateGoalInput = Partial<CreateGoalInput>;

export type GoalReference = Types.ObjectId | Goal;
