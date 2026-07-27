import { Types } from "mongoose";

import {
  CapabilityModel,
  CareerCaseModel,
  GoalModel,
  MenteeModel,
  RecommendationModel,
} from "@/models";
import { connectToDatabase } from "@/lib/db/mongoose";
import { getDefaultMentorId } from "@/lib/mentor/default-mentor";
import type { RecommendationFormValues } from "@/features/recommendations/schemas/recommendation-form.schema";
import {
  serializeRecommendation,
  type RecommendationDashboardStats,
  type SerializedRecommendation,
  type SerializedRecommendationDetail,
  type SerializedRecommendationSummary,
} from "@/features/recommendations/lib/serialize-recommendation";
import { isValidObjectId } from "@/features/mentees/lib/serialize-mentee";
import {
  ActivityEntityType,
  ActivityType,
} from "@/types/domain/activity-enums";
import { RecommendationStatus } from "@/types/domain/recommendation";
import { getDefaultActorName, logActivity } from "@/services/activity.service";

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

async function assertRecommendationAccess(
  careerCaseId: string,
  recommendationId: string,
) {
  const careerCase = await assertCareerCaseAccess(careerCaseId);

  if (!careerCase || !isValidObjectId(recommendationId)) {
    return null;
  }

  const recommendation = await RecommendationModel.findOne({
    _id: recommendationId,
    careerCaseId: careerCase._id,
  });

  if (!recommendation) {
    return null;
  }

  return { careerCase, recommendation };
}

async function validateOptionalLinkIds(
  careerCaseId: Types.ObjectId,
  capabilityId?: string,
  goalId?: string,
) {
  let validatedCapabilityId: Types.ObjectId | undefined;
  let validatedGoalId: Types.ObjectId | undefined;

  if (capabilityId?.trim()) {
    if (!isValidObjectId(capabilityId)) {
      return null;
    }

    const capability = await CapabilityModel.findOne({
      _id: capabilityId,
      careerCaseId,
    });

    if (!capability) {
      return null;
    }

    validatedCapabilityId = capability._id;
  }

  if (goalId?.trim()) {
    if (!isValidObjectId(goalId)) {
      return null;
    }

    const goal = await GoalModel.findOne({
      _id: goalId,
      careerCaseId,
    });

    if (!goal) {
      return null;
    }

    validatedGoalId = goal._id;
  }

  return {
    capabilityId: validatedCapabilityId,
    goalId: validatedGoalId,
  };
}

function toRecommendationPayload(values: RecommendationFormValues) {
  return {
    title: values.title,
    description: values.description,
    priority: values.priority,
    status: values.status,
  };
}

async function enrichRecommendationSummaries(
  recommendations: SerializedRecommendation[],
): Promise<SerializedRecommendationSummary[]> {
  const capabilityIds = recommendations
    .map((recommendation) => recommendation.capabilityId)
    .filter((id): id is string => !!id);
  const goalIds = recommendations
    .map((recommendation) => recommendation.goalId)
    .filter((id): id is string => !!id);

  const [capabilities, goals] = await Promise.all([
    capabilityIds.length > 0
      ? CapabilityModel.find({ _id: { $in: capabilityIds } }).select("_id name")
      : Promise.resolve([]),
    goalIds.length > 0
      ? GoalModel.find({ _id: { $in: goalIds } }).select("_id title")
      : Promise.resolve([]),
  ]);

  const capabilityNameById = new Map(
    capabilities.map((capability) => [capability._id.toString(), capability.name]),
  );
  const goalTitleById = new Map(
    goals.map((goal) => [goal._id.toString(), goal.title]),
  );

  return recommendations.map((recommendation) => ({
    ...recommendation,
    relatedCapabilityName: recommendation.capabilityId
      ? capabilityNameById.get(recommendation.capabilityId) ?? null
      : null,
    relatedGoalTitle: recommendation.goalId
      ? goalTitleById.get(recommendation.goalId) ?? null
      : null,
  }));
}

export async function listRecommendationsByCareerCase(
  careerCaseId: string,
): Promise<SerializedRecommendationSummary[]> {
  const careerCase = await assertCareerCaseAccess(careerCaseId);

  if (!careerCase) {
    return [];
  }

  const recommendations = await RecommendationModel.find({
    careerCaseId: careerCase._id,
  }).sort({ createdAt: -1 });

  const serialized = recommendations.map(serializeRecommendation);
  return enrichRecommendationSummaries(serialized);
}

export async function getRecommendationDetails(
  careerCaseId: string,
  recommendationId: string,
): Promise<SerializedRecommendationDetail | null> {
  const access = await assertRecommendationAccess(careerCaseId, recommendationId);

  if (!access) {
    return null;
  }

  const serialized = serializeRecommendation(access.recommendation);
  let relatedCapability: SerializedRecommendationDetail["relatedCapability"] = null;
  let relatedGoal: SerializedRecommendationDetail["relatedGoal"] = null;

  if (serialized.capabilityId) {
    const capability = await CapabilityModel.findById(serialized.capabilityId).select(
      "_id name",
    );

    if (capability) {
      relatedCapability = {
        _id: capability._id.toString(),
        name: capability.name,
      };
    }
  }

  if (serialized.goalId) {
    const goal = await GoalModel.findById(serialized.goalId).select("_id title");

    if (goal) {
      relatedGoal = {
        _id: goal._id.toString(),
        title: goal.title,
      };
    }
  }

  return {
    ...serialized,
    relatedCapability,
    relatedGoal,
  };
}

export async function createRecommendation(
  careerCaseId: string,
  values: RecommendationFormValues,
): Promise<SerializedRecommendation | null> {
  const careerCase = await assertCareerCaseAccess(careerCaseId);

  if (!careerCase) {
    return null;
  }

  const links = await validateOptionalLinkIds(
    careerCase._id,
    values.capabilityId,
    values.goalId,
  );

  if (!links) {
    return null;
  }

  const recommendation = await RecommendationModel.create({
    ...toRecommendationPayload(values),
    careerCaseId: careerCase._id,
    capabilityId: links.capabilityId,
    goalId: links.goalId,
  });

  const actor = await getDefaultActorName();

  await logActivity({
    careerCaseId: careerCase._id,
    type: ActivityType.RecommendationCreated,
    title: "Recommendation Created",
    actor,
    entityType: ActivityEntityType.Recommendation,
    entityId: recommendation._id,
    metadata: {
      description: recommendation.title,
    },
  });

  if (recommendation.status === RecommendationStatus.COMPLETED) {
    await logActivity({
      careerCaseId: careerCase._id,
      type: ActivityType.RecommendationCompleted,
      title: "Recommendation Completed",
      actor,
      entityType: ActivityEntityType.Recommendation,
      entityId: recommendation._id,
      metadata: {
        description: recommendation.title,
      },
    });
  }

  return serializeRecommendation(recommendation);
}

export async function updateRecommendation(
  careerCaseId: string,
  recommendationId: string,
  values: RecommendationFormValues,
): Promise<SerializedRecommendation | null> {
  const access = await assertRecommendationAccess(careerCaseId, recommendationId);

  if (!access) {
    return null;
  }

  const links = await validateOptionalLinkIds(
    access.careerCase._id,
    values.capabilityId,
    values.goalId,
  );

  if (!links) {
    return null;
  }

  const wasCompleted =
    access.recommendation.status === RecommendationStatus.COMPLETED;

  const recommendation = await RecommendationModel.findOneAndUpdate(
    { _id: recommendationId, careerCaseId: access.careerCase._id },
    {
      $set: {
        ...toRecommendationPayload(values),
        capabilityId: links.capabilityId ?? null,
        goalId: links.goalId ?? null,
      },
    },
    { new: true, runValidators: true },
  );

  if (!recommendation) {
    return null;
  }

  const actor = await getDefaultActorName();

  await logActivity({
    careerCaseId: access.careerCase._id,
    type: ActivityType.RecommendationUpdated,
    title: "Recommendation Updated",
    actor,
    entityType: ActivityEntityType.Recommendation,
    entityId: recommendation._id,
    metadata: {
      description: recommendation.title,
    },
  });

  if (
    !wasCompleted &&
    recommendation.status === RecommendationStatus.COMPLETED
  ) {
    await logActivity({
      careerCaseId: access.careerCase._id,
      type: ActivityType.RecommendationCompleted,
      title: "Recommendation Completed",
      actor,
      entityType: ActivityEntityType.Recommendation,
      entityId: recommendation._id,
      metadata: {
        description: recommendation.title,
      },
    });
  }

  return serializeRecommendation(recommendation);
}

export async function deleteRecommendation(
  careerCaseId: string,
  recommendationId: string,
): Promise<boolean> {
  const access = await assertRecommendationAccess(careerCaseId, recommendationId);

  if (!access) {
    return false;
  }

  await RecommendationModel.findByIdAndDelete(access.recommendation._id);

  const actor = await getDefaultActorName();

  await logActivity({
    careerCaseId: access.careerCase._id,
    type: ActivityType.RecommendationDeleted,
    title: "Recommendation Deleted",
    actor,
    entityType: ActivityEntityType.Recommendation,
    entityId: access.recommendation._id,
    metadata: {
      description: access.recommendation.title,
    },
  });

  return true;
}

export async function getRecommendationDashboardStats(
  careerCaseId: string,
): Promise<RecommendationDashboardStats | null> {
  const careerCase = await assertCareerCaseAccess(careerCaseId);

  if (!careerCase) {
    return null;
  }

  const recommendations = await RecommendationModel.find({
    careerCaseId: careerCase._id,
  }).select("status");

  const total = recommendations.length;
  const completedRecommendations = recommendations.filter(
    (recommendation) => recommendation.status === RecommendationStatus.COMPLETED,
  ).length;
  const activeRecommendations = recommendations.filter(
    (recommendation) =>
      recommendation.status === RecommendationStatus.PENDING ||
      recommendation.status === RecommendationStatus.IN_PROGRESS,
  ).length;
  const completionRate =
    total > 0 ? Math.round((completedRecommendations / total) * 100) : 0;

  return {
    activeRecommendations,
    completedRecommendations,
    completionRate,
  };
}

export async function getRecommendationSnapshotStats(careerCaseId: string) {
  const careerCase = await assertCareerCaseAccess(careerCaseId);

  if (!careerCase) {
    return null;
  }

  const recommendations = await RecommendationModel.find({
    careerCaseId: careerCase._id,
  }).select("status");

  const totalRecommendations = recommendations.length;
  const completedRecommendations = recommendations.filter(
    (recommendation) => recommendation.status === RecommendationStatus.COMPLETED,
  ).length;
  const activeRecommendations = recommendations.filter(
    (recommendation) =>
      recommendation.status === RecommendationStatus.PENDING ||
      recommendation.status === RecommendationStatus.IN_PROGRESS,
  ).length;

  return {
    totalRecommendations,
    activeRecommendations,
    completedRecommendations,
  };
}
