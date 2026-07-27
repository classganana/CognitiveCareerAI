import { Schema, model, models, type Model, type SchemaOptions } from "mongoose";

import type { Activity } from "@/types/domain/activity";
import {
  ACTIVITY_ENTITY_TYPES,
  ACTIVITY_TYPES,
} from "@/types/domain/activity-enums";

import { objectIdRef } from "./shared";

const activitySchemaOptions: SchemaOptions = {
  timestamps: { createdAt: true, updatedAt: false },
  versionKey: false,
};

const ActivitySchema = new Schema<Activity>(
  {
    careerCaseId: objectIdRef("CareerCase"),
    type: {
      type: String,
      enum: ACTIVITY_TYPES,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    actor: {
      type: String,
      required: true,
      trim: true,
    },
    entityType: {
      type: String,
      enum: ACTIVITY_ENTITY_TYPES,
      required: true,
    },
    entityId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
  },
  activitySchemaOptions,
);

ActivitySchema.index({ careerCaseId: 1, createdAt: -1 });
ActivitySchema.index({ entityType: 1, entityId: 1 });

export const ActivityModel: Model<Activity> =
  models.Activity ?? model<Activity>("Activity", ActivitySchema);
