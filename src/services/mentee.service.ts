import {
  CapabilityModel,
  CareerCaseModel,
  GoalModel,
  MeetingModel,
  MenteeModel,
  RecommendationModel,
} from "@/models";
import { connectToDatabase } from "@/lib/db/mongoose";
import { getDefaultMentorId } from "@/lib/mentor/default-mentor";
import {
  isValidObjectId,
  serializeCareerCase,
  serializeMentee,
} from "@/features/mentees/lib/serialize-mentee";
import type { CreateMenteeInput, UpdateMenteeInput } from "@/types/domain/mentee";
import { MenteeStatus } from "@/types/domain/mentee";
import { CareerCaseStatus } from "@/types/domain/career-case";
import {
  ActivityEntityType,
  ActivityType,
} from "@/types/domain/activity-enums";
import {
  getDefaultActorName,
  logActivity,
} from "@/services/activity.service";

export async function listMentees() {
  await connectToDatabase();
  const mentorId = await getDefaultMentorId();

  const mentees = await MenteeModel.find({ mentorId }).sort({ createdAt: -1 });

  return mentees.map(serializeMentee);
}

export async function getMenteeById(id: string) {
  if (!isValidObjectId(id)) {
    return null;
  }

  await connectToDatabase();
  const mentorId = await getDefaultMentorId();

  const mentee = await MenteeModel.findOne({ _id: id, mentorId });

  if (!mentee) {
    return null;
  }

  const careerCase = await CareerCaseModel.findOne({ menteeId: mentee._id });

  let summary = {
    capabilitiesCount: 0,
    goalsCount: 0,
    meetingsCount: 0,
    recommendationsCount: 0,
  };

  if (careerCase) {
    const [capabilitiesCount, goalsCount, meetingsCount, recommendationsCount] =
      await Promise.all([
        CapabilityModel.countDocuments({ careerCaseId: careerCase._id }),
        GoalModel.countDocuments({ careerCaseId: careerCase._id }),
        MeetingModel.countDocuments({ careerCaseId: careerCase._id }),
        RecommendationModel.countDocuments({ careerCaseId: careerCase._id }),
      ]);

    summary = {
      capabilitiesCount,
      goalsCount,
      meetingsCount,
      recommendationsCount,
    };
  }

  return {
    mentee: serializeMentee(mentee),
    careerCase: careerCase ? serializeCareerCase(careerCase) : null,
    summary,
  };
}

export async function createMentee(input: CreateMenteeInput) {
  await connectToDatabase();
  const mentorId = await getDefaultMentorId();

  const mentee = await MenteeModel.create({
    ...input,
    mentorId,
    status: input.status ?? MenteeStatus.ACTIVE,
  });

  const careerCase = await CareerCaseModel.create({
    menteeId: mentee._id,
    title: `${mentee.fullName}'s Career Case`,
    stage: mentee.careerStage,
    status: CareerCaseStatus.ACTIVE,
  });

  const actor = await getDefaultActorName();

  await logActivity({
    careerCaseId: careerCase._id,
    type: ActivityType.CareerCaseCreated,
    title: "Career Case Created",
    actor,
    entityType: ActivityEntityType.CareerCase,
    entityId: careerCase._id,
    metadata: {
      description: careerCase.title,
    },
  });

  return {
    mentee: serializeMentee(mentee),
    careerCase: serializeCareerCase(careerCase),
  };
}

export async function updateMentee(id: string, input: UpdateMenteeInput) {
  if (!isValidObjectId(id)) {
    return null;
  }

  await connectToDatabase();
  const mentorId = await getDefaultMentorId();

  const mentee = await MenteeModel.findOneAndUpdate(
    { _id: id, mentorId },
    { $set: input },
    { new: true, runValidators: true },
  );

  if (!mentee) {
    return null;
  }

  if (input.careerStage) {
    await CareerCaseModel.updateOne(
      { menteeId: mentee._id },
      { $set: { stage: input.careerStage } },
    );
  }

  return serializeMentee(mentee);
}

export { deleteMenteeWithRelatedData } from "./mentee-cascade-delete";
