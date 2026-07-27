import type { Recommendation } from "@/types/domain/recommendation";

export type SerializedRecommendation = {
  _id: string;
  careerCaseId: string;
  title: string;
  description: string;
  status: Recommendation["status"];
  priority: Recommendation["priority"];
  capabilityId: string | null;
  goalId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type SerializedRecommendationSummary = SerializedRecommendation & {
  relatedCapabilityName: string | null;
  relatedGoalTitle: string | null;
};

export type SerializedRecommendationDetail = SerializedRecommendation & {
  relatedCapability: { _id: string; name: string } | null;
  relatedGoal: { _id: string; title: string } | null;
};

export type RecommendationDashboardStats = {
  activeRecommendations: number;
  completedRecommendations: number;
  completionRate: number;
};

export function serializeRecommendation(
  recommendation: Recommendation,
): SerializedRecommendation {
  return {
    _id: recommendation._id.toString(),
    careerCaseId: recommendation.careerCaseId.toString(),
    title: recommendation.title,
    description: recommendation.description,
    status: recommendation.status,
    priority: recommendation.priority,
    capabilityId: recommendation.capabilityId?.toString() ?? null,
    goalId: recommendation.goalId?.toString() ?? null,
    createdAt: recommendation.createdAt.toISOString(),
    updatedAt: recommendation.updatedAt.toISOString(),
  };
}
