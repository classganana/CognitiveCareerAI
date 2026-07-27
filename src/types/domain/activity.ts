import type { Types } from "mongoose";

import type { ActivityEntityType, ActivityType } from "@/types/domain/activity-enums";

export interface Activity {
  _id: Types.ObjectId;
  careerCaseId: Types.ObjectId;
  type: ActivityType;
  title: string;
  actor: string;
  entityType: ActivityEntityType;
  entityId: Types.ObjectId;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}

export type LogActivityInput = {
  careerCaseId: Types.ObjectId | string;
  type: ActivityType;
  title: string;
  actor: string;
  entityType: ActivityEntityType;
  entityId: Types.ObjectId | string;
  metadata?: Record<string, unknown>;
};

export type ActivityReference = Types.ObjectId | Activity;
