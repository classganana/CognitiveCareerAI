import { Types } from "mongoose";

import {
  CareerCaseModel,
  KnowledgeClaimEvidenceModel,
  KnowledgeClaimModel,
  MeetingModel,
  MenteeModel,
  ObservationModel,
} from "@/models";
import { connectToDatabase } from "@/lib/db/mongoose";
import { getDefaultMentorId } from "@/lib/mentor/default-mentor";
import type { KnowledgeEditValues } from "@/features/knowledge/schemas/knowledge-edit.schema";
import type { PromoteObservationValues } from "@/features/knowledge/schemas/promote-observation.schema";
import {
  serializeKnowledgeClaim,
  type SerializedKnowledgeClaim,
  type SerializedKnowledgeClaimDetail,
  type SerializedKnowledgeClaimSummary,
  type SerializedKnowledgeEvidence,
} from "@/features/knowledge/lib/serialize-knowledge";
import { serializeObservation } from "@/features/meetings/lib/serialize-meeting";
import { isValidObjectId } from "@/features/mentees/lib/serialize-mentee";
import {
  ActivityEntityType,
  ActivityType,
} from "@/types/domain/activity-enums";
import { KnowledgeValidationStatus } from "@/types/domain/knowledge-domain";
import { getDefaultActorName, logActivity } from "@/services/activity.service";

async function assertMentorAccess() {
  await connectToDatabase();
  const mentorId = await getDefaultMentorId();
  return mentorId;
}

async function assertObservationAccess(observationId: string) {
  if (!isValidObjectId(observationId)) {
    return null;
  }

  await connectToDatabase();
  const mentorId = await getDefaultMentorId();

  const observation = await ObservationModel.findById(observationId);

  if (!observation) {
    return null;
  }

  const meeting = await MeetingModel.findById(observation.meetingId);

  if (!meeting) {
    return null;
  }

  const careerCase = await CareerCaseModel.findById(meeting.careerCaseId);

  if (!careerCase) {
    return null;
  }

  const mentee = await MenteeModel.findOne({
    _id: careerCase.menteeId,
    mentorId,
  });

  if (!mentee) {
    return null;
  }

  return { observation, meeting, careerCase };
}

async function assertKnowledgeClaimAccess(knowledgeId: string) {
  if (!isValidObjectId(knowledgeId)) {
    return null;
  }

  await assertMentorAccess();

  const claim = await KnowledgeClaimModel.findById(knowledgeId);

  if (!claim) {
    return null;
  }

  return claim;
}

async function logKnowledgeActivity(
  claim: { _id: Types.ObjectId; title: string; originCareerCaseId?: Types.ObjectId },
  type: ActivityType,
  title: string,
) {
  if (!claim.originCareerCaseId) {
    return;
  }

  const actor = await getDefaultActorName();

  await logActivity({
    careerCaseId: claim.originCareerCaseId,
    type,
    title,
    actor,
    entityType: ActivityEntityType.KnowledgeClaim,
    entityId: claim._id,
    metadata: {
      description: claim.title,
    },
  });
}

async function buildKnowledgeDetail(
  claim: Awaited<ReturnType<typeof assertKnowledgeClaimAccess>>,
): Promise<SerializedKnowledgeClaimDetail | null> {
  if (!claim) {
    return null;
  }

  const serialized = serializeKnowledgeClaim(claim);
  const evidenceRecords = await KnowledgeClaimEvidenceModel.find({
    knowledgeClaimId: claim._id,
  }).sort({ createdAt: 1 });

  const observationIds = evidenceRecords.map((record) => record.observationId);
  const observations =
    observationIds.length > 0
      ? await ObservationModel.find({ _id: { $in: observationIds } })
      : [];
  const observationById = new Map(
    observations.map((observation) => [
      observation._id.toString(),
      serializeObservation(observation),
    ]),
  );

  const evidence: SerializedKnowledgeEvidence[] = evidenceRecords.map((record) => ({
    _id: record._id.toString(),
    knowledgeClaimId: record.knowledgeClaimId.toString(),
    observationId: record.observationId.toString(),
    rationale: record.rationale ?? null,
    observation: observationById.get(record.observationId.toString()) ?? null,
    createdAt: record.createdAt.toISOString(),
  }));

  return {
    ...serialized,
    evidence,
  };
}

export async function listKnowledgeClaims(): Promise<SerializedKnowledgeClaimSummary[]> {
  await assertMentorAccess();

  const claims = await KnowledgeClaimModel.find().sort({ createdAt: -1 });

  return claims.map((claim) => {
    const serialized = serializeKnowledgeClaim(claim);

    return {
      ...serialized,
      supportingObservationsCount: serialized.evidenceIds.length,
    };
  });
}

export async function getKnowledgeClaimDetails(
  knowledgeId: string,
): Promise<SerializedKnowledgeClaimDetail | null> {
  const claim = await assertKnowledgeClaimAccess(knowledgeId);
  return buildKnowledgeDetail(claim);
}

export async function getObservationPromotionMap(observationIds: string[]) {
  const validIds = observationIds.filter(isValidObjectId);

  if (validIds.length === 0) {
    return {};
  }

  await assertMentorAccess();

  const evidenceRecords = await KnowledgeClaimEvidenceModel.find({
    observationId: { $in: validIds },
  }).select("observationId knowledgeClaimId");

  const map: Record<string, string> = {};

  for (const record of evidenceRecords) {
    map[record.observationId.toString()] = record.knowledgeClaimId.toString();
  }

  return map;
}

export async function promoteObservation(
  values: PromoteObservationValues,
): Promise<SerializedKnowledgeClaim | null> {
  const access = await assertObservationAccess(values.observationId);

  if (!access) {
    return null;
  }

  const existingEvidence = await KnowledgeClaimEvidenceModel.findOne({
    observationId: access.observation._id,
  });

  if (existingEvidence) {
    return null;
  }

  const claim = await KnowledgeClaimModel.create({
    title: values.title,
    statement: values.summary,
    domain: values.domain,
    tags: values.tags.filter(Boolean),
    confidence: 50,
    validationStatus: KnowledgeValidationStatus.DRAFT,
    archived: false,
    originCareerCaseId: access.careerCase._id,
    evidenceIds: [],
  });

  const evidence = await KnowledgeClaimEvidenceModel.create({
    knowledgeClaimId: claim._id,
    observationId: access.observation._id,
  });

  claim.evidenceIds.push(evidence._id);
  await claim.save();

  await logKnowledgeActivity(claim, ActivityType.KnowledgeClaimCreated, "Knowledge Claim Created");

  return serializeKnowledgeClaim(claim);
}

export async function updateKnowledgeClaim(
  knowledgeId: string,
  values: KnowledgeEditValues,
): Promise<SerializedKnowledgeClaim | null> {
  const existing = await assertKnowledgeClaimAccess(knowledgeId);

  if (!existing) {
    return null;
  }

  const wasValidated =
    existing.validationStatus === KnowledgeValidationStatus.VALIDATED;

  const claim = await KnowledgeClaimModel.findByIdAndUpdate(
    knowledgeId,
    {
      $set: {
        title: values.title,
        statement: values.summary,
        domain: values.domain,
        tags: values.tags.filter(Boolean),
        confidence: values.confidence,
        validationStatus: values.validationStatus,
      },
    },
    { new: true, runValidators: true },
  );

  if (!claim) {
    return null;
  }

  await logKnowledgeActivity(claim, ActivityType.KnowledgeClaimUpdated, "Knowledge Claim Updated");

  if (
    !wasValidated &&
    claim.validationStatus === KnowledgeValidationStatus.VALIDATED
  ) {
    await logKnowledgeActivity(
      claim,
      ActivityType.KnowledgeClaimValidated,
      "Knowledge Claim Validated",
    );
  }

  return serializeKnowledgeClaim(claim);
}

export async function archiveKnowledgeClaim(
  knowledgeId: string,
): Promise<SerializedKnowledgeClaim | null> {
  const existing = await assertKnowledgeClaimAccess(knowledgeId);

  if (!existing || existing.archived) {
    return null;
  }

  const claim = await KnowledgeClaimModel.findByIdAndUpdate(
    knowledgeId,
    { $set: { archived: true } },
    { new: true, runValidators: true },
  );

  if (!claim) {
    return null;
  }

  await logKnowledgeActivity(claim, ActivityType.KnowledgeClaimArchived, "Knowledge Claim Archived");

  return serializeKnowledgeClaim(claim);
}

export async function addEvidenceToKnowledgeClaim(
  knowledgeId: string,
  observationId: string,
): Promise<SerializedKnowledgeClaimDetail | null> {
  const claim = await assertKnowledgeClaimAccess(knowledgeId);

  if (!claim) {
    return null;
  }

  const access = await assertObservationAccess(observationId);

  if (!access) {
    return null;
  }

  const existingForObservation = await KnowledgeClaimEvidenceModel.findOne({
    observationId: access.observation._id,
  });

  if (existingForObservation) {
    return null;
  }

  const existingForClaim = await KnowledgeClaimEvidenceModel.findOne({
    knowledgeClaimId: claim._id,
    observationId: access.observation._id,
  });

  if (existingForClaim) {
    return buildKnowledgeDetail(claim);
  }

  const evidence = await KnowledgeClaimEvidenceModel.create({
    knowledgeClaimId: claim._id,
    observationId: access.observation._id,
  });

  await KnowledgeClaimModel.findByIdAndUpdate(claim._id, {
    $push: { evidenceIds: evidence._id },
  });

  await logKnowledgeActivity(claim, ActivityType.KnowledgeClaimUpdated, "Knowledge Claim Updated");

  return getKnowledgeClaimDetails(knowledgeId);
}

export async function removeEvidenceFromKnowledgeClaim(
  knowledgeId: string,
  evidenceId: string,
): Promise<SerializedKnowledgeClaimDetail | null> {
  const claim = await assertKnowledgeClaimAccess(knowledgeId);

  if (!claim || !isValidObjectId(evidenceId)) {
    return null;
  }

  const evidence = await KnowledgeClaimEvidenceModel.findOne({
    _id: evidenceId,
    knowledgeClaimId: claim._id,
  });

  if (!evidence) {
    return null;
  }

  await KnowledgeClaimEvidenceModel.findByIdAndDelete(evidence._id);
  await KnowledgeClaimModel.findByIdAndUpdate(claim._id, {
    $pull: { evidenceIds: evidence._id },
  });

  await logKnowledgeActivity(claim, ActivityType.KnowledgeClaimUpdated, "Knowledge Claim Updated");

  return getKnowledgeClaimDetails(knowledgeId);
}

export async function listAvailableObservationsForKnowledgeClaim(
  knowledgeId: string,
) {
  const claim = await assertKnowledgeClaimAccess(knowledgeId);

  if (!claim) {
    return [];
  }

  const mentorId = await getDefaultMentorId();
  const mentees = await MenteeModel.find({ mentorId }).select("_id");
  const menteeIds = mentees.map((mentee) => mentee._id);

  const careerCases = await CareerCaseModel.find({
    menteeId: { $in: menteeIds },
  }).select("_id");
  const careerCaseIds = careerCases.map((careerCase) => careerCase._id);

  const meetings = await MeetingModel.find({
    careerCaseId: { $in: careerCaseIds },
  }).select("_id");
  const meetingIds = meetings.map((meeting) => meeting._id);

  if (meetingIds.length === 0) {
    return [];
  }

  const linkedEvidence = await KnowledgeClaimEvidenceModel.find().select("observationId");
  const linkedObservationIds = new Set(
    linkedEvidence.map((record) => record.observationId.toString()),
  );

  const observations = await ObservationModel.find({
    meetingId: { $in: meetingIds },
  }).sort({ createdAt: -1 });

  return observations
    .filter((observation) => !linkedObservationIds.has(observation._id.toString()))
    .map(serializeObservation);
}
