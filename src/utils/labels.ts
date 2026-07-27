import { CareerStage } from "@/types/enums";
import { MenteeStatus } from "@/types/domain/mentee";

export const CAREER_STAGE_LABELS: Record<CareerStage, string> = {
  [CareerStage.EXPLORATION]: "Exploration",
  [CareerStage.PREPARATION]: "Preparation",
  [CareerStage.ACTIVE_SEARCH]: "Active Search",
  [CareerStage.INTERVIEWING]: "Interviewing",
  [CareerStage.OFFER_NEGOTIATION]: "Offer Negotiation",
  [CareerStage.ONBOARDING]: "Onboarding",
  [CareerStage.GROWTH]: "Growth",
};

export const MENTEE_STATUS_LABELS: Record<MenteeStatus, string> = {
  [MenteeStatus.ACTIVE]: "Active",
  [MenteeStatus.INACTIVE]: "Inactive",
  [MenteeStatus.ON_HOLD]: "On Hold",
};

export function formatCareerStage(stage: CareerStage): string {
  return CAREER_STAGE_LABELS[stage] ?? stage;
}

export function formatMenteeStatus(status: MenteeStatus): string {
  return MENTEE_STATUS_LABELS[status] ?? status;
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}
