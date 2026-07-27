export enum KnowledgeDomain {
  TECHNICAL = "technical",
  COMMUNICATION = "communication",
  LEADERSHIP = "leadership",
  LEARNING = "learning",
  BEHAVIOUR = "behaviour",
  CAREER_PLANNING = "career_planning",
  OTHER = "other",
}

export const KNOWLEDGE_DOMAINS = Object.values(KnowledgeDomain);

export enum KnowledgeValidationStatus {
  DRAFT = "draft",
  VALIDATED = "validated",
  DEPRECATED = "deprecated",
}

export const KNOWLEDGE_VALIDATION_STATUSES = Object.values(KnowledgeValidationStatus);
