import type { Types } from "mongoose";

import type { CareerStage } from "@/types/enums";

import type { BaseEntity } from "./base";

export enum CareerCaseStatus {
  ACTIVE = "active",
  PAUSED = "paused",
  CLOSED = "closed",
}

export interface CareerCase extends BaseEntity {
  menteeId: Types.ObjectId;
  title: string;
  description?: string;
  stage: CareerStage;
  status: CareerCaseStatus;
}

export type CreateCareerCaseInput = Pick<
  CareerCase,
  "menteeId" | "title" | "stage" | "status"
> &
  Partial<Pick<CareerCase, "description">>;

export type UpdateCareerCaseInput = Partial<CreateCareerCaseInput>;

export type CareerCaseReference = Types.ObjectId | CareerCase;
