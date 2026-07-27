import type { Types } from "mongoose";

import type { SessionType } from "@/types/enums";

import type { BaseEntity } from "./base";

export interface Meeting extends BaseEntity {
  careerCaseId: Types.ObjectId;
  sessionDate: Date;
  sessionType: SessionType;
  durationMinutes: number;
  summary: string;
}

export type CreateMeetingInput = Pick<
  Meeting,
  "careerCaseId" | "sessionDate" | "sessionType" | "durationMinutes" | "summary"
>;

export type UpdateMeetingInput = Partial<
  Omit<CreateMeetingInput, "careerCaseId">
>;

export type MeetingReference = Types.ObjectId | Meeting;
