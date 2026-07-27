import { ActivityModel } from "@/models";
import { connectToDatabase } from "@/lib/db/mongoose";
import { getCurrentMentorDisplayName } from "@/lib/mentor/default-mentor";
import { isValidObjectId } from "@/features/mentees/lib/serialize-mentee";
import type { ActivityEvent } from "@/features/career-cases/types";
import type { Activity, LogActivityInput } from "@/types/domain/activity";
import { Types } from "mongoose";

export type SerializedActivity = Omit<
  Activity,
  "_id" | "careerCaseId" | "entityId" | "createdAt"
> & {
  _id: string;
  careerCaseId: string;
  entityId: string;
  createdAt: string;
};

function serializeActivity(activity: Activity): SerializedActivity {
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

export function toActivityEvent(activity: SerializedActivity): ActivityEvent {
  const description =
    typeof activity.metadata?.description === "string"
      ? activity.metadata.description
      : undefined;

  return {
    id: activity._id,
    type: mapActivityTypeToLegacyEventType(activity.type),
    title: activity.title,
    description,
    occurredAt: activity.createdAt,
  };
}

function mapActivityTypeToLegacyEventType(
  type: SerializedActivity["type"],
): ActivityEvent["type"] {
  switch (type) {
    case "CareerCaseCreated":
      return "career_case_created";
    case "MeetingCreated":
      return "meeting_logged";
    case "ObservationCreated":
      return "observation_added";
    case "CapabilityCreated":
      return "capability_created";
    case "CapabilityUpdated":
      return "capability_updated";
    case "CapabilityDeleted":
      return "capability_deleted";
    case "GoalCreated":
      return "goal_added";
    case "GoalUpdated":
      return "goal_updated";
    case "GoalDeleted":
      return "goal_deleted";
    case "TaskCreated":
      return "task_created";
    case "TaskCompleted":
      return "task_completed";
    case "TaskDeleted":
      return "task_deleted";
    case "RecommendationCreated":
      return "recommendation_added";
    case "RecommendationUpdated":
      return "recommendation_updated";
    case "RecommendationCompleted":
      return "recommendation_completed";
    case "RecommendationDeleted":
      return "recommendation_deleted";
    case "KnowledgeClaimCreated":
      return "knowledge_created";
    case "KnowledgeClaimUpdated":
      return "knowledge_updated";
    case "KnowledgeClaimValidated":
      return "knowledge_validated";
    case "KnowledgeClaimArchived":
      return "knowledge_archived";
    default:
      return "career_case_created";
  }
}

export async function getDefaultActorName(): Promise<string> {
  return getCurrentMentorDisplayName();
}

export async function logActivity(input: LogActivityInput): Promise<SerializedActivity> {
  await connectToDatabase();

  const activity = await ActivityModel.create({
    careerCaseId: new Types.ObjectId(input.careerCaseId),
    type: input.type,
    title: input.title,
    actor: input.actor,
    entityType: input.entityType,
    entityId: new Types.ObjectId(input.entityId),
    metadata: input.metadata,
  });

  return serializeActivity(activity);
}

export async function getActivitiesByCareerCase(
  careerCaseId: string,
): Promise<ActivityEvent[]> {
  if (!isValidObjectId(careerCaseId)) {
    return [];
  }

  await connectToDatabase();

  const activities = await ActivityModel.find({ careerCaseId })
    .sort({ createdAt: -1 })
    .lean();

  return activities.map((activity) =>
    toActivityEvent(serializeActivity(activity as Activity)),
  );
}
