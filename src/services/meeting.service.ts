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
import {
  serializeMeeting,
  serializeObservation,
  type SerializedMeeting,
  type SerializedMeetingWithObservationCount,
  type SerializedObservation,
} from "@/features/meetings/lib/serialize-meeting";
import type { CreateMeetingInput } from "@/types/domain/meeting";
import type { CreateObservationInput, UpdateObservationInput } from "@/types/domain/observation";
import {
  ActivityEntityType,
  ActivityType,
} from "@/types/domain/activity-enums";
import {
  getDefaultActorName,
  logActivity,
} from "@/services/activity.service";
import { formatSessionType } from "@/utils/session-labels";
import { isValidObjectId } from "@/features/mentees/lib/serialize-mentee";

async function assertCareerCaseAccess(careerCaseId: string) {
  if (!isValidObjectId(careerCaseId)) {
    return null;
  }

  await connectToDatabase();
  const mentorId = await getDefaultMentorId();

  const careerCase = await CareerCaseModel.findById(careerCaseId);

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

  return careerCase;
}

async function assertMeetingAccess(meetingId: string) {
  if (!isValidObjectId(meetingId)) {
    return null;
  }

  await connectToDatabase();
  const mentorId = await getDefaultMentorId();

  const meeting = await MeetingModel.findById(meetingId);

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

  return meeting;
}

export async function listMeetingsByCareerCase(
  careerCaseId: string,
): Promise<SerializedMeetingWithObservationCount[]> {
  const careerCase = await assertCareerCaseAccess(careerCaseId);

  if (!careerCase) {
    return [];
  }

  const meetings = await MeetingModel.find({ careerCaseId: careerCase._id }).sort({
    sessionDate: -1,
  });

  const meetingIds = meetings.map((meeting) => meeting._id);
  const observationCounts = await ObservationModel.aggregate<{ _id: string; count: number }>([
    { $match: { meetingId: { $in: meetingIds } } },
    { $group: { _id: "$meetingId", count: { $sum: 1 } } },
  ]);

  const countByMeetingId = new Map(
    observationCounts.map((entry) => [entry._id.toString(), entry.count]),
  );

  return meetings.map((meeting) => ({
    ...serializeMeeting(meeting),
    observationsCount: countByMeetingId.get(meeting._id.toString()) ?? 0,
  }));
}

export async function createMeeting(
  careerCaseId: string,
  input: Omit<CreateMeetingInput, "careerCaseId">,
): Promise<SerializedMeeting | null> {
  const careerCase = await assertCareerCaseAccess(careerCaseId);

  if (!careerCase) {
    return null;
  }

  const meeting = await MeetingModel.create({
    ...input,
    careerCaseId: careerCase._id,
  });

  const actor = await getDefaultActorName();

  await logActivity({
    careerCaseId: careerCase._id,
    type: ActivityType.MeetingCreated,
    title: "Mentoring Session Logged",
    actor,
    entityType: ActivityEntityType.Meeting,
    entityId: meeting._id,
    metadata: {
      description: formatSessionType(meeting.sessionType),
    },
  });

  return serializeMeeting(meeting);
}

export async function getMeetingDetails(
  meetingId: string,
  careerCaseId?: string,
): Promise<{
  meeting: SerializedMeeting;
  observations: SerializedObservation[];
} | null> {
  const meeting = await assertMeetingAccess(meetingId);

  if (!meeting) {
    return null;
  }

  if (careerCaseId && meeting.careerCaseId.toString() !== careerCaseId) {
    return null;
  }

  const observations = await ObservationModel.find({ meetingId: meeting._id }).sort({
    createdAt: -1,
  });

  return {
    meeting: serializeMeeting(meeting),
    observations: observations.map(serializeObservation),
  };
}

export async function deleteMeeting(
  meetingId: string,
  careerCaseId?: string,
): Promise<boolean> {
  const meeting = await assertMeetingAccess(meetingId);

  if (!meeting) {
    return false;
  }

  if (careerCaseId && meeting.careerCaseId.toString() !== careerCaseId) {
    return false;
  }

  const observations = await ObservationModel.find({ meetingId: meeting._id }).select("_id");
  const observationIds = observations.map((observation) => observation._id);

  if (observationIds.length > 0) {
    await deleteObservationsByIds(observationIds.map((id) => id.toString()));
  }

  await MeetingModel.findByIdAndDelete(meeting._id);

  return true;
}

async function deleteObservationsByIds(observationIds: string[]) {
  const objectIds = observationIds.filter(isValidObjectId);

  if (objectIds.length === 0) {
    return;
  }

  const evidenceRecords = await KnowledgeClaimEvidenceModel.find({
    observationId: { $in: objectIds },
  }).select("_id knowledgeClaimId");

  if (evidenceRecords.length > 0) {
    await Promise.all(
      evidenceRecords.map((evidence) =>
        KnowledgeClaimModel.updateOne(
          { _id: evidence.knowledgeClaimId },
          { $pull: { evidenceIds: evidence._id } },
        ),
      ),
    );

    await KnowledgeClaimEvidenceModel.deleteMany({
      _id: { $in: evidenceRecords.map((evidence) => evidence._id) },
    });
  }

  await ObservationModel.deleteMany({ _id: { $in: objectIds } });
}

export async function createObservation(
  meetingId: string,
  input: Omit<CreateObservationInput, "meetingId">,
): Promise<SerializedObservation | null> {
  const meeting = await assertMeetingAccess(meetingId);

  if (!meeting) {
    return null;
  }

  const observation = await ObservationModel.create({
    ...input,
    meetingId: meeting._id,
  });

  const actor = await getDefaultActorName();

  await logActivity({
    careerCaseId: meeting.careerCaseId,
    type: ActivityType.ObservationCreated,
    title: "Observation Added",
    actor,
    entityType: ActivityEntityType.Observation,
    entityId: observation._id,
    metadata: {
      description: observation.title,
    },
  });

  return serializeObservation(observation);
}

export async function updateObservation(
  observationId: string,
  input: UpdateObservationInput,
): Promise<SerializedObservation | null> {
  if (!isValidObjectId(observationId)) {
    return null;
  }

  const observation = await ObservationModel.findById(observationId);

  if (!observation) {
    return null;
  }

  const meeting = await assertMeetingAccess(observation.meetingId.toString());

  if (!meeting) {
    return null;
  }

  const updated = await ObservationModel.findByIdAndUpdate(
    observationId,
    { $set: input },
    { new: true, runValidators: true },
  );

  if (!updated) {
    return null;
  }

  return serializeObservation(updated);
}

export async function deleteObservation(observationId: string): Promise<boolean> {
  if (!isValidObjectId(observationId)) {
    return false;
  }

  const observation = await ObservationModel.findById(observationId);

  if (!observation) {
    return false;
  }

  const meeting = await assertMeetingAccess(observation.meetingId.toString());

  if (!meeting) {
    return false;
  }

  await deleteObservationsByIds([observationId]);

  return true;
}
