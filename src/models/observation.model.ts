import { Schema, model, models, type Model } from "mongoose";

import type { Observation } from "@/types/domain/observation";
import {
  OBSERVATION_CATEGORIES,
  OBSERVATION_SEVERITIES,
} from "@/types/enums";

import { defaultSchemaOptions, objectIdRef } from "./shared";

const ObservationSchema = new Schema<Observation>(
  {
    meetingId: objectIdRef("Meeting"),
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
    category: {
      type: String,
      enum: OBSERVATION_CATEGORIES,
      required: true,
    },
    severity: {
      type: String,
      enum: OBSERVATION_SEVERITIES,
      required: true,
    },
  },
  defaultSchemaOptions,
);

ObservationSchema.index({ meetingId: 1 });
ObservationSchema.index({ createdAt: -1 });

export const ObservationModel: Model<Observation> =
  models.Observation ?? model<Observation>("Observation", ObservationSchema);
