export enum CareerStage {
  EXPLORATION = "exploration",
  PREPARATION = "preparation",
  ACTIVE_SEARCH = "active_search",
  INTERVIEWING = "interviewing",
  OFFER_NEGOTIATION = "offer_negotiation",
  ONBOARDING = "onboarding",
  GROWTH = "growth",
}

export enum CapabilityLevel {
  EMERGING = "emerging",
  DEVELOPING = "developing",
  PROFICIENT = "proficient",
  ADVANCED = "advanced",
  EXPERT = "expert",
}

export enum KnowledgeStatus {
  DRAFT = "draft",
  UNDER_REVIEW = "under_review",
  APPROVED = "approved",
  ARCHIVED = "archived",
  DEPRECATED = "deprecated",
}

export enum SessionType {
  INITIAL_ASSESSMENT = "initial_assessment",
  WEEKLY_REVIEW = "weekly_review",
  MONTHLY_REVIEW = "monthly_review",
  MOCK_INTERVIEW = "mock_interview",
  RESUME_REVIEW = "resume_review",
  CAREER_PLANNING = "career_planning",
  OTHER = "other",
}

export enum ObservationCategory {
  TECHNICAL = "technical",
  COMMUNICATION = "communication",
  LEADERSHIP = "leadership",
  LEARNING = "learning",
  BEHAVIOUR = "behaviour",
  CAREER_PLANNING = "career_planning",
  OTHER = "other",
}

export enum ObservationSeverity {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export const CAREER_STAGES = Object.values(CareerStage);
export const CAPABILITY_LEVELS = Object.values(CapabilityLevel);
export const KNOWLEDGE_STATUSES = Object.values(KnowledgeStatus);
export const SESSION_TYPES = Object.values(SessionType);
export const OBSERVATION_CATEGORIES = Object.values(ObservationCategory);
export const OBSERVATION_SEVERITIES = Object.values(ObservationSeverity);
