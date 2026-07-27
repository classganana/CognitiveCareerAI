import type { Types } from "mongoose";

import type { CapabilityLevel } from "@/types/enums";
import type { CapabilityCategory } from "@/types/domain/capability-category";

import type { BaseEntity } from "./base";

export interface Capability extends BaseEntity {
  careerCaseId: Types.ObjectId;
  name: string;
  category: CapabilityCategory;
  level: CapabilityLevel;
  confidence: number;
  notes?: string;
  lastReviewedAt?: Date;
  supportingObservations: Types.ObjectId[];
}

export type CreateCapabilityInput = Pick<
  Capability,
  "careerCaseId" | "name" | "category" | "level"
> &
  Partial<
    Pick<
      Capability,
      "confidence" | "notes" | "lastReviewedAt" | "supportingObservations"
    >
  >;

export type UpdateCapabilityInput = Partial<
  Omit<CreateCapabilityInput, "careerCaseId">
>;

export type CapabilityReference = Types.ObjectId | Capability;
