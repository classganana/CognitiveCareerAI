import { Schema, model, models, type Model } from "mongoose";

import type { KnowledgeClaim } from "@/types/domain/knowledge-claim";
import {
  KNOWLEDGE_DOMAINS,
  KNOWLEDGE_VALIDATION_STATUSES,
  KnowledgeValidationStatus,
} from "@/types/domain/knowledge-domain";

import { defaultSchemaOptions, objectIdRef, objectIdRefArray } from "./shared";

const KnowledgeClaimSchema = new Schema<KnowledgeClaim>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    statement: {
      type: String,
      required: true,
      trim: true,
    },
    domain: {
      type: String,
      enum: KNOWLEDGE_DOMAINS,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    confidence: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
      required: true,
    },
    validationStatus: {
      type: String,
      enum: KNOWLEDGE_VALIDATION_STATUSES,
      default: KnowledgeValidationStatus.DRAFT,
      required: true,
    },
    archived: {
      type: Boolean,
      default: false,
      required: true,
    },
    originCareerCaseId: objectIdRef("CareerCase"),
    evidenceIds: objectIdRefArray("KnowledgeClaimEvidence"),
  },
  defaultSchemaOptions,
);

KnowledgeClaimSchema.index({ validationStatus: 1 });
KnowledgeClaimSchema.index({ domain: 1 });
KnowledgeClaimSchema.index({ archived: 1 });
KnowledgeClaimSchema.index({ evidenceIds: 1 });

export const KnowledgeClaimModel: Model<KnowledgeClaim> =
  models.KnowledgeClaim ??
  model<KnowledgeClaim>("KnowledgeClaim", KnowledgeClaimSchema);
