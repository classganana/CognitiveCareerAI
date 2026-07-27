import {
  ActivityModel,
  CapabilityModel,
  CareerCaseModel,
  GoalModel,
  KnowledgeClaimModel,
  MeetingModel,
  MenteeModel,
  ObservationModel,
  RecommendationModel,
} from "@/models";
import { connectToDatabase } from "@/lib/db/mongoose";
import { getDefaultMentorId } from "@/lib/mentor/default-mentor";
import type { ActivityEventType } from "@/features/career-cases/types";
import { toActivityEvent, type SerializedActivity } from "@/services/activity.service";
import type { Activity } from "@/types/domain/activity";
import { CareerCaseStatus } from "@/types/domain/career-case";
import { GoalStatus } from "@/types/domain/goal";
import { KnowledgeValidationStatus } from "@/types/domain/knowledge-domain";
import { RecommendationStatus } from "@/types/domain/recommendation";

export type DashboardMetrics = {
  totalMentees: number;
  activeCareerCases: number;
  meetingsConducted: number;
  observationsLogged: number;
  capabilitiesAssessed: number;
  activeGoals: number;
  activeRecommendations: number;
  knowledgeClaims: number;
  validatedKnowledgeClaims: number;
};

export type DashboardActivityItem = {
  id: string;
  type: ActivityEventType;
  title: string;
  actor: string;
  description?: string;
  occurredAt: string;
  careerCaseId: string;
};

export type DashboardData = {
  metrics: DashboardMetrics;
  recentActivity: DashboardActivityItem[];
  defaultSessionCareerCaseId: string | null;
};

export async function getDashboardData(): Promise<DashboardData> {
  await connectToDatabase();
  const mentorId = await getDefaultMentorId();

  const mentees = await MenteeModel.find({ mentorId }).select("_id");
  const menteeIds = mentees.map((mentee) => mentee._id);

  const careerCases = await CareerCaseModel.find({
    menteeId: { $in: menteeIds },
  }).select("_id status updatedAt");
  const careerCaseIds = careerCases.map((careerCase) => careerCase._id);

  const meetings = await MeetingModel.find({
    careerCaseId: { $in: careerCaseIds },
  }).select("_id");
  const meetingIds = meetings.map((meeting) => meeting._id);

  const goals = await GoalModel.find({
    careerCaseId: { $in: careerCaseIds },
  }).select("_id status");

  const [
    observationsLogged,
    capabilitiesAssessed,
    activeRecommendations,
    knowledgeClaims,
    validatedKnowledgeClaims,
    recentActivities,
  ] = await Promise.all([
    meetingIds.length > 0
      ? ObservationModel.countDocuments({ meetingId: { $in: meetingIds } })
      : Promise.resolve(0),
    CapabilityModel.countDocuments({ careerCaseId: { $in: careerCaseIds } }),
    RecommendationModel.countDocuments({
      careerCaseId: { $in: careerCaseIds },
      status: { $in: [RecommendationStatus.PENDING, RecommendationStatus.IN_PROGRESS] },
    }),
    KnowledgeClaimModel.countDocuments({ archived: false }),
    KnowledgeClaimModel.countDocuments({
      archived: false,
      validationStatus: KnowledgeValidationStatus.VALIDATED,
    }),
    careerCaseIds.length > 0
      ? ActivityModel.find({ careerCaseId: { $in: careerCaseIds } })
          .sort({ createdAt: -1 })
          .limit(12)
          .lean()
      : Promise.resolve([]),
  ]);

  const activeCareerCases = careerCases.filter(
    (careerCase) => careerCase.status === CareerCaseStatus.ACTIVE,
  ).length;

  const activeGoals = goals.filter(
    (goal) => goal.status !== GoalStatus.COMPLETED,
  ).length;

  const defaultSessionCareerCase =
    careerCases
      .filter((careerCase) => careerCase.status === CareerCaseStatus.ACTIVE)
      .sort(
        (left, right) => right.updatedAt.getTime() - left.updatedAt.getTime(),
      )[0] ?? careerCases[0];

  return {
    metrics: {
      totalMentees: mentees.length,
      activeCareerCases,
      meetingsConducted: meetings.length,
      observationsLogged,
      capabilitiesAssessed,
      activeGoals,
      activeRecommendations,
      knowledgeClaims,
      validatedKnowledgeClaims,
    },
    recentActivity: recentActivities.map((activity) => {
      const serialized = toActivityEvent(
        serializeDashboardActivity(activity as Activity),
      );

      return {
        id: serialized.id,
        type: serialized.type,
        title: serialized.title,
        actor: (activity as Activity).actor,
        description: serialized.description,
        occurredAt: serialized.occurredAt,
        careerCaseId: (activity as Activity).careerCaseId.toString(),
      };
    }),
    defaultSessionCareerCaseId: defaultSessionCareerCase?._id.toString() ?? null,
  };
}

function serializeDashboardActivity(activity: Activity): SerializedActivity {
  return {
    _id: activity._id.toString(),
    careerCaseId: activity.careerCaseId.toString(),
    type: activity.type,
    title: activity.title,
    actor: activity.actor,
    entityType: activity.entityType,
    entityId: activity.entityId.toString(),
    metadata: activity.metadata,
    createdAt: activity.createdAt.toISOString(),
  };
}
