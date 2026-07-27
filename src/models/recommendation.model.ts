import { Schema, model, models, type Model } from "mongoose";

import type { Recommendation } from "@/types/domain/recommendation";
import {
  RECOMMENDATION_PRIORITIES,
  RECOMMENDATION_STATUSES,
  RecommendationStatus,
} from "@/types/domain/recommendation";
import { GoalPriority } from "@/types/domain/goal";

import { defaultSchemaOptions, objectIdRef } from "./shared";

const RecommendationSchema = new Schema<Recommendation>(
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
    status: {
      type: String,
      enum: RECOMMENDATION_STATUSES,
      default: RecommendationStatus.PENDING,
      required: true,
    },
    priority: {
      type: String,
      enum: RECOMMENDATION_PRIORITIES,
      default: GoalPriority.MEDIUM,
      required: true,
    },
    capabilityId: {
      type: Schema.Types.ObjectId,
      ref: "Capability",
    },
    goalId: {
      type: Schema.Types.ObjectId,
      ref: "Goal",
    },
  },
  defaultSchemaOptions,
);

RecommendationSchema.index({ careerCaseId: 1 });
RecommendationSchema.index({ status: 1 });
RecommendationSchema.index({ capabilityId: 1 }, { sparse: true });
RecommendationSchema.index({ goalId: 1 }, { sparse: true });

export const RecommendationModel: Model<Recommendation> =
  models.Recommendation ??
  model<Recommendation>("Recommendation", RecommendationSchema);
