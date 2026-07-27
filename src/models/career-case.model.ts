import { Schema, model, models, type Model } from "mongoose";

import type { CareerCase } from "@/types/domain/career-case";
import { CareerCaseStatus } from "@/types/domain/career-case";
import { CAREER_STAGES } from "@/types/enums";

import { defaultSchemaOptions, objectIdRef } from "./shared";

const CareerCaseSchema = new Schema<CareerCase>(
  {
    menteeId: objectIdRef("Mentee"),
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    stage: {
      type: String,
      enum: CAREER_STAGES,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(CareerCaseStatus),
      default: CareerCaseStatus.ACTIVE,
      required: true,
    },
  },
  defaultSchemaOptions,
);

CareerCaseSchema.index({ menteeId: 1 });
CareerCaseSchema.index({ status: 1 });

export const CareerCaseModel: Model<CareerCase> =
  models.CareerCase ?? model<CareerCase>("CareerCase", CareerCaseSchema);
