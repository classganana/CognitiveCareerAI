import type {
  SerializedKnowledgeClaim,
  SerializedKnowledgeClaimDetail,
  SerializedKnowledgeClaimSummary,
} from "@/features/knowledge/lib/serialize-knowledge";
import type { KnowledgeEditValues } from "@/features/knowledge/schemas/knowledge-edit.schema";
import type { PromoteObservationValues } from "@/features/knowledge/schemas/promote-observation.schema";
import type { SerializedObservation } from "@/features/meetings/lib/serialize-meeting";

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error ?? "Request failed");
  }

  return payload.data as T;
}

export async function fetchKnowledgeClaims(): Promise<SerializedKnowledgeClaimSummary[]> {
  const response = await fetch("/api/knowledge");
  return parseResponse<SerializedKnowledgeClaimSummary[]>(response);
}

export async function fetchKnowledgeClaimDetails(
  knowledgeId: string,
): Promise<SerializedKnowledgeClaimDetail> {
  const response = await fetch(`/api/knowledge/${knowledgeId}`);
  return parseResponse<SerializedKnowledgeClaimDetail>(response);
}

export async function promoteObservation(
  values: PromoteObservationValues,
): Promise<SerializedKnowledgeClaim> {
  const response = await fetch("/api/knowledge/promote", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  return parseResponse<SerializedKnowledgeClaim>(response);
}

export async function updateKnowledgeClaim(
  knowledgeId: string,
  values: KnowledgeEditValues,
): Promise<SerializedKnowledgeClaim> {
  const response = await fetch(`/api/knowledge/${knowledgeId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  return parseResponse<SerializedKnowledgeClaim>(response);
}

export async function archiveKnowledgeClaim(
  knowledgeId: string,
): Promise<SerializedKnowledgeClaim> {
  const response = await fetch(`/api/knowledge/${knowledgeId}/archive`, {
    method: "POST",
  });

  return parseResponse<SerializedKnowledgeClaim>(response);
}

export async function addEvidenceToKnowledgeClaim(
  knowledgeId: string,
  observationId: string,
): Promise<SerializedKnowledgeClaimDetail> {
  const response = await fetch(`/api/knowledge/${knowledgeId}/evidence`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ observationId }),
  });

  return parseResponse<SerializedKnowledgeClaimDetail>(response);
}

export async function removeEvidenceFromKnowledgeClaim(
  knowledgeId: string,
  evidenceId: string,
): Promise<SerializedKnowledgeClaimDetail> {
  const response = await fetch(
    `/api/knowledge/${knowledgeId}/evidence/${evidenceId}`,
    { method: "DELETE" },
  );

  return parseResponse<SerializedKnowledgeClaimDetail>(response);
}

export async function fetchAvailableObservationsForKnowledgeClaim(
  knowledgeId: string,
): Promise<SerializedObservation[]> {
  const response = await fetch(`/api/knowledge/${knowledgeId}/available-observations`);
  return parseResponse<SerializedObservation[]>(response);
}

export async function fetchObservationPromotionMap(
  observationIds: string[],
): Promise<Record<string, string>> {
  const response = await fetch("/api/knowledge/promotion-map", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ observationIds }),
  });

  return parseResponse<Record<string, string>>(response);
}
