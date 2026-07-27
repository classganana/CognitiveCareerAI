import { CapabilityCategory } from "@/types/domain/capability-category";
import { CapabilityLevel } from "@/types/enums";

export const CAPABILITY_CATEGORY_LABELS: Record<CapabilityCategory, string> = {
  [CapabilityCategory.TECHNICAL]: "Technical",
  [CapabilityCategory.SOFT_SKILLS]: "Soft Skills",
  [CapabilityCategory.LEADERSHIP]: "Leadership",
  [CapabilityCategory.BUSINESS]: "Business",
  [CapabilityCategory.CAREER]: "Career",
};

export const CAPABILITY_LEVEL_LABELS: Record<CapabilityLevel, string> = {
  [CapabilityLevel.EMERGING]: "Emerging",
  [CapabilityLevel.DEVELOPING]: "Developing",
  [CapabilityLevel.PROFICIENT]: "Proficient",
  [CapabilityLevel.ADVANCED]: "Advanced",
  [CapabilityLevel.EXPERT]: "Expert",
};

export function formatCapabilityCategory(category: CapabilityCategory): string {
  return CAPABILITY_CATEGORY_LABELS[category] ?? category;
}

export function formatCapabilityLevel(level: CapabilityLevel): string {
  return CAPABILITY_LEVEL_LABELS[level] ?? level;
}
