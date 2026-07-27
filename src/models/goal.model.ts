import { Schema, model, models, type Model } from "mongoose";

import type { Goal } from "@/types/domain/goal";
import { GOAL_PRIORITIES, GOAL_STATUSES } from "@/types/domain/goal";

import { defaultSchemaOptions, objectIdRef } from "./shared";

const GoalSchema = new Schema<Goal>(
  {
    careerCaseId: objectIdRef("CareerCase"),
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    targetDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: GOAL_STATUSES,
      required: true,
    },
    priority: {
      type: String,
      enum: GOAL_PRIORITIES,
      required: true,
    },
  },
  defaultSchemaOptions,
);

GoalSchema.index({ careerCaseId: 1 });
GoalSchema.index({ status: 1 });
GoalSchema.index({ targetDate: 1 }, { sparse: true });

export const GoalModel: Model<Goal> =
  models.Goal ?? model<Goal>("Goal", GoalSchema);
