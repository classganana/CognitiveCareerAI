import {
  ObservationCategory,
  ObservationSeverity,
  SessionType,
} from "@/types/enums";

export const SESSION_TYPE_LABELS: Record<SessionType, string> = {
  [SessionType.INITIAL_ASSESSMENT]: "Initial Assessment",
  [SessionType.WEEKLY_REVIEW]: "Weekly Review",
  [SessionType.MONTHLY_REVIEW]: "Monthly Review",
  [SessionType.MOCK_INTERVIEW]: "Mock Interview",
  [SessionType.RESUME_REVIEW]: "Resume Review",
  [SessionType.CAREER_PLANNING]: "Career Planning",
  [SessionType.OTHER]: "Other",
};

export const OBSERVATION_CATEGORY_LABELS: Record<ObservationCategory, string> = {
  [ObservationCategory.TECHNICAL]: "Technical",
  [ObservationCategory.COMMUNICATION]: "Communication",
  [ObservationCategory.LEADERSHIP]: "Leadership",
  [ObservationCategory.LEARNING]: "Learning",
  [ObservationCategory.BEHAVIOUR]: "Behaviour",
  [ObservationCategory.CAREER_PLANNING]: "Career Planning",
  [ObservationCategory.OTHER]: "Other",
};

export const OBSERVATION_SEVERITY_LABELS: Record<ObservationSeverity, string> = {
  [ObservationSeverity.LOW]: "Low",
  [ObservationSeverity.MEDIUM]: "Medium",
  [ObservationSeverity.HIGH]: "High",
};

export function formatSessionType(type: SessionType): string {
  return SESSION_TYPE_LABELS[type] ?? type;
}

export function formatObservationCategory(category: ObservationCategory): string {
  return OBSERVATION_CATEGORY_LABELS[category] ?? category;
}

export function formatObservationSeverity(severity: ObservationSeverity): string {
  return OBSERVATION_SEVERITY_LABELS[severity] ?? severity;
}
