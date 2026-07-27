import type { Capability } from "@/types/domain/capability";
import type { SerializedObservation } from "@/features/meetings/lib/serialize-meeting";

export type SerializedCapability = Omit<
  Capability,
  "_id" | "careerCaseId" | "lastReviewedAt" | "supportingObservations" | "createdAt" | "updatedAt"
> & {
  _id: string;
  careerCaseId: string;
  lastReviewedAt: string | null;
  supportingObservations: string[];
  createdAt: string;
  updatedAt: string;
};

export type SerializedCapabilitySummary = SerializedCapability & {
  supportingObservationsCount: number;
};

export type SerializedCapabilityDetail = SerializedCapability & {
  linkedObservations: SerializedObservation[];
};

export function serializeCapability(capability: Capability): SerializedCapability {
  return {
    _id: capability._id.toString(),
    careerCaseId: capability.careerCaseId.toString(),
    name: capability.name,
    category: capability.category,
    level: capability.level,
    confidence: capability.confidence,
    notes: capability.notes,
    lastReviewedAt: capability.lastReviewedAt?.toISOString() ?? null,
    supportingObservations: capability.supportingObservations.map((id) =>
      id.toString(),
    ),
    createdAt: capability.createdAt.toISOString(),
    updatedAt: capability.updatedAt.toISOString(),
  };
}
