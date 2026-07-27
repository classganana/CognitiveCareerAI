export enum ActivityType {
  CareerCaseCreated = "CareerCaseCreated",
  MeetingCreated = "MeetingCreated",
  ObservationCreated = "ObservationCreated",
  CapabilityCreated = "CapabilityCreated",
  CapabilityUpdated = "CapabilityUpdated",
  CapabilityDeleted = "CapabilityDeleted",
  GoalCreated = "GoalCreated",
  GoalUpdated = "GoalUpdated",
  GoalDeleted = "GoalDeleted",
  TaskCreated = "TaskCreated",
  TaskCompleted = "TaskCompleted",
  TaskDeleted = "TaskDeleted",
  RecommendationCreated = "RecommendationCreated",
  RecommendationUpdated = "RecommendationUpdated",
  RecommendationCompleted = "RecommendationCompleted",
  RecommendationDeleted = "RecommendationDeleted",
  KnowledgeClaimCreated = "KnowledgeClaimCreated",
  KnowledgeClaimUpdated = "KnowledgeClaimUpdated",
  KnowledgeClaimValidated = "KnowledgeClaimValidated",
  KnowledgeClaimArchived = "KnowledgeClaimArchived",
}

export enum ActivityEntityType {
  CareerCase = "CareerCase",
  Meeting = "Meeting",
  Observation = "Observation",
  Capability = "Capability",
  Goal = "Goal",
  Task = "Task",
  Recommendation = "Recommendation",
  KnowledgeClaim = "KnowledgeClaim",
}

export const ACTIVITY_TYPES = Object.values(ActivityType);
export const ACTIVITY_ENTITY_TYPES = Object.values(ActivityEntityType);
