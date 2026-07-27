import type { KnowledgeClaim } from "@/types/domain/knowledge-claim";
import type { SerializedObservation } from "@/features/meetings/lib/serialize-meeting";

export type SerializedKnowledgeClaim = {
  _id: string;
  title: string;
  statement: string;
  domain: KnowledgeClaim["domain"];
  tags: string[];
  confidence: number;
  validationStatus: KnowledgeClaim["validationStatus"];
  archived: boolean;
  originCareerCaseId: string | null;
  evidenceIds: string[];
  createdAt: string;
  updatedAt: string;
};

export type SerializedKnowledgeClaimSummary = SerializedKnowledgeClaim & {
  supportingObservationsCount: number;
};

export type SerializedKnowledgeEvidence = {
  _id: string;
  knowledgeClaimId: string;
  observationId: string;
  rationale: string | null;
  observation: SerializedObservation | null;
  createdAt: string;
};

export type SerializedKnowledgeClaimDetail = SerializedKnowledgeClaim & {
  evidence: SerializedKnowledgeEvidence[];
};

export function serializeKnowledgeClaim(
  claim: KnowledgeClaim,
): SerializedKnowledgeClaim {
  return {
    _id: claim._id.toString(),
    title: claim.title,
    statement: claim.statement,
    domain: claim.domain,
    tags: claim.tags ?? [],
    confidence: claim.confidence,
    validationStatus: claim.validationStatus,
    archived: claim.archived,
    originCareerCaseId: claim.originCareerCaseId?.toString() ?? null,
    evidenceIds: claim.evidenceIds.map((id) => id.toString()),
    createdAt: claim.createdAt.toISOString(),
    updatedAt: claim.updatedAt.toISOString(),
  };
}
