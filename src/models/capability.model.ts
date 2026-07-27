import { Schema, model, models, type Model } from "mongoose";

import type { Capability } from "@/types/domain/capability";
import { CAPABILITY_CATEGORIES } from "@/types/domain/capability-category";
import { CAPABILITY_LEVELS } from "@/types/enums";

import { defaultSchemaOptions, objectIdRef, objectIdRefArray } from "./shared";

const CapabilitySchema = new Schema<Capability>(
  {
    careerCaseId: objectIdRef("CareerCase"),
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: CAPABILITY_CATEGORIES,
      required: true,
    },
    level: {
      type: String,
      enum: CAPABILITY_LEVELS,
      required: true,
    },
    confidence: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
      required: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    lastReviewedAt: {
      type: Date,
    },
    supportingObservations: objectIdRefArray("Observation"),
  },
  defaultSchemaOptions,
);

CapabilitySchema.index({ careerCaseId: 1 });
CapabilitySchema.index({ supportingObservations: 1 });
CapabilitySchema.index({ lastReviewedAt: -1 });

export const CapabilityModel: Model<Capability> =
  models.Capability ?? model<Capability>("Capability", CapabilitySchema);
