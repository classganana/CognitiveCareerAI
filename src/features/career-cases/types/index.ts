export type ActivityEventType =
  | "career_case_created"
  | "goal_added"
  | "goal_updated"
  | "goal_deleted"
  | "task_created"
  | "task_completed"
  | "task_deleted"
  | "meeting_logged"
  | "observation_added"
  | "capability_created"
  | "capability_updated"
  | "capability_deleted"
  | "recommendation_added"
  | "recommendation_updated"
  | "recommendation_completed"
  | "recommendation_deleted"
  | "knowledge_created"
  | "knowledge_updated"
  | "knowledge_validated"
  | "knowledge_archived";

export type ActivityEvent = {
  id: string;
  type: ActivityEventType;
  title: string;
  description?: string;
  occurredAt: string;
};

export type CareerCaseWorkspaceCounts = {
  meetingsCount: number;
  observationsCount: number;
  capabilitiesCount: number;
  goalsCount: number;
  tasksCount: number;
  recommendationsCount: number;
};

export type CareerSnapshot = {
  careerStage: string;
  currentRole: string;
  targetRole: string;
  totalCapabilities: number;
  averageConfidence: number;
  lastAssessmentDate: string | null;
  activeGoals: number;
  completedGoals: number;
  overallGoalProgress: number;
  totalRecommendations: number;
  activeRecommendations: number;
  completedRecommendations: number;
};

export type CareerCaseWorkspaceTab =
  | "overview"
  | "meetings"
  | "observations"
  | "capabilities"
  | "goals"
  | "recommendations";

export const CAREER_CASE_WORKSPACE_TABS: {
  value: CareerCaseWorkspaceTab;
  label: string;
}[] = [
  { value: "overview", label: "Overview" },
  { value: "meetings", label: "Meetings" },
  { value: "observations", label: "Observations" },
  { value: "capabilities", label: "Capabilities" },
  { value: "goals", label: "Goals" },
  { value: "recommendations", label: "Recommendations" },
];

export function isCareerCaseWorkspaceTab(
  value: string | undefined,
): value is CareerCaseWorkspaceTab {
  return CAREER_CASE_WORKSPACE_TABS.some((tab) => tab.value === value);
}
