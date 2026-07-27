import { Schema, model, models, type Model } from "mongoose";

import type { Meeting } from "@/types/domain/meeting";
import { SESSION_TYPES } from "@/types/enums";

import { defaultSchemaOptions, objectIdRef } from "./shared";

const MeetingSchema = new Schema<Meeting>(
  {
    careerCaseId: objectIdRef("CareerCase"),
    sessionDate: {
      type: Date,
      required: true,
    },
    sessionType: {
      type: String,
      enum: SESSION_TYPES,
      required: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 1,
    },
    summary: {
      type: String,
      trim: true,
      default: "",
    },
  },
  defaultSchemaOptions,
);

MeetingSchema.index({ careerCaseId: 1 });
MeetingSchema.index({ sessionDate: -1 });

export const MeetingModel: Model<Meeting> =
  models.Meeting ?? model<Meeting>("Meeting", MeetingSchema);
