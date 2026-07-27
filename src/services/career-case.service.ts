import {
  CapabilityModel,
  CareerCaseModel,
  GoalModel,
  MeetingModel,
  MenteeModel,
  ObservationModel,
  RecommendationModel,
  TaskModel,
} from "@/models";
import { connectToDatabase } from "@/lib/db/mongoose";
import { getDefaultMentorId } from "@/lib/mentor/default-mentor";
import { getActivitiesByCareerCase } from "@/services/activity.service";
import { getCareerSnapshot } from "@/services/capability.service";
import { getGoalSnapshotStats } from "@/services/goal.service";
import { getRecommendationSnapshotStats } from "@/services/recommendation.service";
import type {
  ActivityEvent,
  CareerCaseWorkspaceCounts,
  CareerSnapshot,
} from "@/features/career-cases/types";
import {
  isValidObjectId,
  serializeCareerCase,
  serializeMentee,
  type SerializedCareerCase,
  type SerializedMentee,
} from "@/features/mentees/lib/serialize-mentee";

export type CareerCaseWorkspaceData = {
  careerCase: SerializedCareerCase;
  mentee: SerializedMentee;
  counts: CareerCaseWorkspaceCounts;
  snapshot: CareerSnapshot;
  activity: ActivityEvent[];
};

async function getWorkspaceCounts(
  careerCaseId: SerializedCareerCase["_id"],
): Promise<CareerCaseWorkspaceCounts> {
  const meetings = await MeetingModel.find({ careerCaseId }).select("_id");
  const meetingIds = meetings.map((meeting) => meeting._id);

  const goals = await GoalModel.find({ careerCaseId }).select("_id");
  const goalIds = goals.map((goal) => goal._id);

  const [
    meetingsCount,
    observationsCount,
    capabilitiesCount,
    goalsCount,
    tasksCount,
    recommendationsCount,
  ] = await Promise.all([
    Promise.resolve(meetings.length),
    meetingIds.length > 0
      ? ObservationModel.countDocuments({ meetingId: { $in: meetingIds } })
      : Promise.resolve(0),
    CapabilityModel.countDocuments({ careerCaseId }),
    Promise.resolve(goals.length),
    goalIds.length > 0
      ? TaskModel.countDocuments({ goalId: { $in: goalIds } })
      : Promise.resolve(0),
    RecommendationModel.countDocuments({ careerCaseId }),
  ]);

  return {
    meetingsCount,
    observationsCount,
    capabilitiesCount,
    goalsCount,
    tasksCount,
    recommendationsCount,
  };
}

export async function getCareerCaseWorkspace(
  careerCaseId: string,
): Promise<CareerCaseWorkspaceData | null> {
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

  const serializedCareerCase = serializeCareerCase(careerCase);
  const counts = await getWorkspaceCounts(serializedCareerCase._id);
  const [activity, snapshotData, goalStats, recommendationStats] = await Promise.all([
    getActivitiesByCareerCase(serializedCareerCase._id),
    getCareerSnapshot(serializedCareerCase._id),
    getGoalSnapshotStats(serializedCareerCase._id),
    getRecommendationSnapshotStats(serializedCareerCase._id),
  ]);

  const snapshot: CareerSnapshot = snapshotData
    ? {
        careerStage: snapshotData.careerStage,
        currentRole: snapshotData.currentRole,
        targetRole: snapshotData.targetRole,
        totalCapabilities: snapshotData.totalCapabilities,
        averageConfidence: snapshotData.averageConfidence,
        lastAssessmentDate: snapshotData.lastAssessmentDate,
        activeGoals: goalStats?.activeGoals ?? 0,
        completedGoals: goalStats?.completedGoals ?? 0,
        overallGoalProgress: goalStats?.overallGoalProgress ?? 0,
        totalRecommendations: recommendationStats?.totalRecommendations ?? 0,
        activeRecommendations: recommendationStats?.activeRecommendations ?? 0,
        completedRecommendations: recommendationStats?.completedRecommendations ?? 0,
      }
    : {
        careerStage: mentee.careerStage,
        currentRole: mentee.currentRole,
        targetRole: mentee.targetRole,
        totalCapabilities: 0,
        averageConfidence: 0,
        lastAssessmentDate: null,
        activeGoals: goalStats?.activeGoals ?? 0,
        completedGoals: goalStats?.completedGoals ?? 0,
        overallGoalProgress: goalStats?.overallGoalProgress ?? 0,
        totalRecommendations: recommendationStats?.totalRecommendations ?? 0,
        activeRecommendations: recommendationStats?.activeRecommendations ?? 0,
        completedRecommendations: recommendationStats?.completedRecommendations ?? 0,
      };

  return {
    careerCase: serializedCareerCase,
    mentee: serializeMentee(mentee),
    counts,
    snapshot,
    activity,
  };
}

export type MenteeListItem = SerializedMentee & {
  careerCaseId: string | null;
};

export async function listMenteesWithCareerCases(): Promise<MenteeListItem[]> {
  await connectToDatabase();
  const mentorId = await getDefaultMentorId();

  const mentees = await MenteeModel.find({ mentorId }).sort({ createdAt: -1 });
  const menteeIds = mentees.map((mentee) => mentee._id);

  const careerCases = await CareerCaseModel.find({
    menteeId: { $in: menteeIds },
  }).select("_id menteeId");

  const careerCaseByMenteeId = new Map(
    careerCases.map((careerCase) => [
      careerCase.menteeId.toString(),
      careerCase._id.toString(),
    ]),
  );

  return mentees.map((mentee) => ({
    ...serializeMentee(mentee),
    careerCaseId: careerCaseByMenteeId.get(mentee._id.toString()) ?? null,
  }));
}

export async function getCareerCaseIdForMentee(
  menteeId: string,
): Promise<string | null> {
  if (!isValidObjectId(menteeId)) {
    return null;
  }

  await connectToDatabase();
  const mentorId = await getDefaultMentorId();

  const mentee = await MenteeModel.findOne({ _id: menteeId, mentorId });

  if (!mentee) {
    return null;
  }

  const careerCase = await CareerCaseModel.findOne({ menteeId: mentee._id }).select(
    "_id",
  );

  return careerCase?._id.toString() ?? null;
}
