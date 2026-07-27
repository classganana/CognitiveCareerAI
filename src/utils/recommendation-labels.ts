import {
  RecommendationStatus,
} from "@/types/domain/recommendation";
import { GoalPriority } from "@/types/domain/goal";

export function formatRecommendationStatus(status: RecommendationStatus) {
  switch (status) {
    case RecommendationStatus.PENDING:
      return "Pending";
    case RecommendationStatus.IN_PROGRESS:
      return "In Progress";
    case RecommendationStatus.COMPLETED:
      return "Completed";
    case RecommendationStatus.CANCELLED:
      return "Cancelled";
    default:
      return status;
  }
}

export function formatRecommendationPriority(priority: GoalPriority) {
  switch (priority) {
    case GoalPriority.LOW:
      return "Low";
    case GoalPriority.MEDIUM:
      return "Medium";
    case GoalPriority.HIGH:
      return "High";
    default:
      return priority;
  }
}
