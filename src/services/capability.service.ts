import {
  CareerCaseModel,
  CapabilityModel,
  MeetingModel,
  MenteeModel,
  ObservationModel,
} from "@/models";
import { connectToDatabase } from "@/lib/db/mongoose";
import { getDefaultMentorId } from "@/lib/mentor/default-mentor";
import {
  serializeCapability,
  type SerializedCapability,
  type SerializedCapabilityDetail,
  type SerializedCapabilitySummary,
} from "@/features/capabilities/lib/serialize-capability";
import type { SerializedObservation } from "@/features/meetings/lib/serialize-meeting";
import { serializeObservation } from "@/features/meetings/lib/serialize-meeting";
import type { CapabilityFormValues } from "@/features/capabilities/schemas/capability-form.schema";
import {
  ActivityEntityType,
  ActivityType,
} from "@/types/domain/activity-enums";
import { getDefaultActorName, logActivity } from "@/services/activity.service";
import { isValidObjectId } from "@/features/mentees/lib/serialize-mentee";
import { Types } from "mongoose";

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

async function getCareerCaseObservationIds(careerCaseId: Types.ObjectId) {
  const meetings = await MeetingModel.find({ careerCaseId }).select("_id");
  const meetingIds = meetings.map((meeting) => meeting._id);

  if (meetingIds.length === 0) {
    return [];
  }

  const observations = await ObservationModel.find({
    meetingId: { $in: meetingIds },
  }).select("_id");

  return observations.map((observation) => observation._id.toString());
}

async function validateObservationIds(
  careerCaseId: Types.ObjectId,
  observationIds: string[],
) {
  if (observationIds.length === 0) {
    return [];
  }

  const validIds = await getCareerCaseObservationIds(careerCaseId);
  const filtered = observationIds.filter((id) => validIds.includes(id));

  return filtered.map((id) => new Types.ObjectId(id));
}

function toCapabilityPayload(values: CapabilityFormValues) {
  return {
    name: values.name,
    category: values.category,
    level: values.level,
    confidence: values.confidence,
    notes: values.notes,
  };
}

export async function listCapabilitiesByCareerCase(
  careerCaseId: string,
): Promise<SerializedCapabilitySummary[]> {
  const careerCase = await assertCareerCaseAccess(careerCaseId);

  if (!careerCase) {
    return [];
  }

  const capabilities = await CapabilityModel.find({
    careerCaseId: careerCase._id,
  }).sort({ lastReviewedAt: -1, updatedAt: -1 });

  return capabilities.map((capability) => {
    const serialized = serializeCapability(capability);

    return {
      ...serialized,
      supportingObservationsCount: serialized.supportingObservations.length,
    };
  });
}

export async function listObservationsForCareerCase(careerCaseId: string) {
  const careerCase = await assertCareerCaseAccess(careerCaseId);

  if (!careerCase) {
    return [];
  }

  const meetings = await MeetingModel.find({ careerCaseId: careerCase._id }).select(
    "_id",
  );
  const meetingIds = meetings.map((meeting) => meeting._id);

  if (meetingIds.length === 0) {
    return [];
  }

  const observations = await ObservationModel.find({
    meetingId: { $in: meetingIds },
  }).sort({ createdAt: -1 });

  return observations.map(serializeObservation);
}

export async function getCapabilityDetails(
  careerCaseId: string,
  capabilityId: string,
): Promise<SerializedCapabilityDetail | null> {
  const careerCase = await assertCareerCaseAccess(careerCaseId);

  if (!careerCase || !isValidObjectId(capabilityId)) {
    return null;
  }

  const capability = await CapabilityModel.findOne({
    _id: capabilityId,
    careerCaseId: careerCase._id,
  });

  if (!capability) {
    return null;
  }

  const serialized = serializeCapability(capability);
  let linkedObservations: SerializedObservation[] = [];

  if (serialized.supportingObservations.length > 0) {
    const observations = await ObservationModel.find({
      _id: { $in: serialized.supportingObservations },
    }).sort({ createdAt: -1 });

    linkedObservations = observations.map(serializeObservation);
  }

  return {
    ...serialized,
    linkedObservations,
  };
}

export async function createCapability(
  careerCaseId: string,
  values: CapabilityFormValues,
): Promise<SerializedCapability | null> {
  const careerCase = await assertCareerCaseAccess(careerCaseId);

  if (!careerCase) {
    return null;
  }

  const supportingObservations = await validateObservationIds(
    careerCase._id,
    values.supportingObservations,
  );

  const now = new Date();

  const capability = await CapabilityModel.create({
    ...toCapabilityPayload(values),
    careerCaseId: careerCase._id,
    supportingObservations,
    lastReviewedAt: now,
  });

  const actor = await getDefaultActorName();

  await logActivity({
    careerCaseId: careerCase._id,
    type: ActivityType.CapabilityCreated,
    title: "Capability Created",
    actor,
    entityType: ActivityEntityType.Capability,
    entityId: capability._id,
    metadata: {
      description: capability.name,
    },
  });

  return serializeCapability(capability);
}

export async function updateCapability(
  careerCaseId: string,
  capabilityId: string,
  values: CapabilityFormValues,
): Promise<SerializedCapability | null> {
  const careerCase = await assertCareerCaseAccess(careerCaseId);

  if (!careerCase || !isValidObjectId(capabilityId)) {
    return null;
  }

  const supportingObservations = await validateObservationIds(
    careerCase._id,
    values.supportingObservations,
  );

  const capability = await CapabilityModel.findOneAndUpdate(
    { _id: capabilityId, careerCaseId: careerCase._id },
    {
      $set: {
        ...toCapabilityPayload(values),
        supportingObservations,
        lastReviewedAt: new Date(),
      },
    },
    { new: true, runValidators: true },
  );

  if (!capability) {
    return null;
  }

  const actor = await getDefaultActorName();

  await logActivity({
    careerCaseId: careerCase._id,
    type: ActivityType.CapabilityUpdated,
    title: "Capability Updated",
    actor,
    entityType: ActivityEntityType.Capability,
    entityId: capability._id,
    metadata: {
      description: capability.name,
    },
  });

  return serializeCapability(capability);
}

export async function deleteCapability(
  careerCaseId: string,
  capabilityId: string,
): Promise<boolean> {
  const careerCase = await assertCareerCaseAccess(careerCaseId);

  if (!careerCase || !isValidObjectId(capabilityId)) {
    return false;
  }

  const capability = await CapabilityModel.findOne({
    _id: capabilityId,
    careerCaseId: careerCase._id,
  });

  if (!capability) {
    return false;
  }

  await CapabilityModel.findByIdAndDelete(capability._id);

  const actor = await getDefaultActorName();

  await logActivity({
    careerCaseId: careerCase._id,
    type: ActivityType.CapabilityDeleted,
    title: "Capability Deleted",
    actor,
    entityType: ActivityEntityType.Capability,
    entityId: capability._id,
    metadata: {
      description: capability.name,
    },
  });

  return true;
}

export async function getCareerSnapshot(careerCaseId: string) {
  const careerCase = await assertCareerCaseAccess(careerCaseId);

  if (!careerCase) {
    return null;
  }

  const mentee = await MenteeModel.findById(careerCase.menteeId);

  if (!mentee) {
    return null;
  }

  const capabilities = await CapabilityModel.find({
    careerCaseId: careerCase._id,
  }).select("confidence lastReviewedAt");

  const totalCapabilities = capabilities.length;
  const averageConfidence =
    totalCapabilities > 0
      ? Math.round(
          capabilities.reduce((sum, capability) => sum + capability.confidence, 0) /
            totalCapabilities,
        )
      : 0;

  const lastAssessmentDate = capabilities.reduce<string | null>((latest, capability) => {
    if (!capability.lastReviewedAt) {
      return latest;
    }

    const reviewedAt = capability.lastReviewedAt.toISOString();

    if (!latest) {
      return reviewedAt;
    }

    return new Date(reviewedAt) > new Date(latest) ? reviewedAt : latest;
  }, null);

  return {
    careerStage: mentee.careerStage,
    currentRole: mentee.currentRole,
    targetRole: mentee.targetRole,
    totalCapabilities,
    averageConfidence,
    lastAssessmentDate,
  };
}
