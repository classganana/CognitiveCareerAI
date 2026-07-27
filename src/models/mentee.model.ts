import { Schema, model, models, type Model } from "mongoose";

import type { Mentee } from "@/types/domain/mentee";
import { MENTEE_STATUSES, MenteeStatus } from "@/types/domain/mentee";
import { CAREER_STAGES } from "@/types/enums";

import { defaultSchemaOptions, objectIdRef } from "./shared";

const MenteeSchema = new Schema<Mentee>(
  {
    mentorId: objectIdRef("User"),
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    currentRole: {
      type: String,
      required: true,
      trim: true,
    },
    targetRole: {
      type: String,
      required: true,
      trim: true,
    },
    careerStage: {
      type: String,
      enum: CAREER_STAGES,
      required: true,
    },
    yearsOfExperience: {
      type: Number,
      required: true,
      min: 0,
    },
    notes: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: MENTEE_STATUSES,
      default: MenteeStatus.ACTIVE,
      required: true,
    },
  },
  defaultSchemaOptions,
);

MenteeSchema.index({ mentorId: 1 });
MenteeSchema.index({ email: 1 });
MenteeSchema.index({ fullName: 1 });

export const MenteeModel: Model<Mentee> =
  models.Mentee ?? model<Mentee>("Mentee", MenteeSchema);
