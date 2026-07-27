import type { Types } from "mongoose";

import type { CareerStage } from "@/types/enums";

import type { BaseEntity } from "./base";

export enum MenteeStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  ON_HOLD = "on_hold",
}

export const MENTEE_STATUSES = Object.values(MenteeStatus);

export interface Mentee extends BaseEntity {
  mentorId: Types.ObjectId;
  fullName: string;
  email: string;
  phone: string;
  currentRole: string;
  targetRole: string;
  careerStage: CareerStage;
  yearsOfExperience: number;
  notes?: string;
  status: MenteeStatus;
}

export type CreateMenteeInput = Pick<
  Mentee,
  | "fullName"
  | "email"
  | "phone"
  | "currentRole"
  | "targetRole"
  | "careerStage"
  | "yearsOfExperience"
> &
  Partial<Pick<Mentee, "notes" | "status">>;

export type UpdateMenteeInput = Partial<CreateMenteeInput>;

export type MenteeReference = Types.ObjectId | Mentee;
