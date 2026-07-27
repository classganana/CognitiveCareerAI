import { Schema, model, models, type Model } from "mongoose";

import type { KnowledgeClaimEvidence } from "@/types/domain/knowledge-claim-evidence";

import { defaultSchemaOptions, objectIdRef } from "./shared";

const KnowledgeClaimEvidenceSchema = new Schema<KnowledgeClaimEvidence>(
  {
    knowledgeClaimId: objectIdRef("KnowledgeClaim"),
    observationId: objectIdRef("Observation"),
    rationale: {
      type: String,
      trim: true,
    },
  },
  defaultSchemaOptions,
);

KnowledgeClaimEvidenceSchema.index({ knowledgeClaimId: 1 });
KnowledgeClaimEvidenceSchema.index({ observationId: 1 });
KnowledgeClaimEvidenceSchema.index(
  { knowledgeClaimId: 1, observationId: 1 },
  { unique: true },
);

export const KnowledgeClaimEvidenceModel: Model<KnowledgeClaimEvidence> =
  models.KnowledgeClaimEvidence ??
  model<KnowledgeClaimEvidence>(
    "KnowledgeClaimEvidence",
    KnowledgeClaimEvidenceSchema,
  );
