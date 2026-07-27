import { GoalPriority, GoalStatus } from "@/types/domain/goal";

export function formatGoalStatus(status: GoalStatus) {
  switch (status) {
    case GoalStatus.NOT_STARTED:
      return "Not Started";
    case GoalStatus.IN_PROGRESS:
      return "In Progress";
    case GoalStatus.COMPLETED:
      return "Completed";
    case GoalStatus.ON_HOLD:
      return "On Hold";
    default:
      return status;
  }
}

export function formatGoalPriority(priority: GoalPriority) {
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
