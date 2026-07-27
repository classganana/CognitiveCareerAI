import type { Types } from "mongoose";

import type { BaseEntity } from "./base";

export interface KnowledgeClaimEvidence extends BaseEntity {
  knowledgeClaimId: Types.ObjectId;
  observationId: Types.ObjectId;
  rationale?: string;
}

export type CreateKnowledgeClaimEvidenceInput = Pick<
  KnowledgeClaimEvidence,
  "knowledgeClaimId" | "observationId"
> &
  Partial<Pick<KnowledgeClaimEvidence, "rationale">>;

export type UpdateKnowledgeClaimEvidenceInput =
  Partial<CreateKnowledgeClaimEvidenceInput>;

export type KnowledgeClaimEvidenceReference =
  | Types.ObjectId
  | KnowledgeClaimEvidence;
