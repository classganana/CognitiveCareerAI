import {
  KnowledgeDomain,
  KnowledgeValidationStatus,
} from "@/types/domain/knowledge-domain";

export function formatKnowledgeDomain(domain: KnowledgeDomain) {
  switch (domain) {
    case KnowledgeDomain.TECHNICAL:
      return "Technical";
    case KnowledgeDomain.COMMUNICATION:
      return "Communication";
    case KnowledgeDomain.LEADERSHIP:
      return "Leadership";
    case KnowledgeDomain.LEARNING:
      return "Learning";
    case KnowledgeDomain.BEHAVIOUR:
      return "Behaviour";
    case KnowledgeDomain.CAREER_PLANNING:
      return "Career Planning";
    case KnowledgeDomain.OTHER:
      return "Other";
    default:
      return domain;
  }
}

export function formatKnowledgeValidationStatus(status: KnowledgeValidationStatus) {
  switch (status) {
    case KnowledgeValidationStatus.DRAFT:
      return "Draft";
    case KnowledgeValidationStatus.VALIDATED:
      return "Validated";
    case KnowledgeValidationStatus.DEPRECATED:
      return "Deprecated";
    default:
      return status;
  }
}
