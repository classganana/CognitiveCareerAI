import type { Types } from "mongoose";

import type { ObservationCategory, ObservationSeverity } from "@/types/enums";

import type { BaseEntity } from "./base";

export interface Observation extends BaseEntity {
  meetingId: Types.ObjectId;
  title: string;
  description: string;
  category: ObservationCategory;
  severity: ObservationSeverity;
}

export type CreateObservationInput = Pick<
  Observation,
  "meetingId" | "title" | "description" | "category" | "severity"
>;

export type UpdateObservationInput = Partial<
  Omit<CreateObservationInput, "meetingId">
>;

export type ObservationReference = Types.ObjectId | Observation;
