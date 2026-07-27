import type { LucideIcon } from "lucide-react";
import {
  Archive,
  BookOpen,
  Briefcase,
  CheckCircle2,
  CircleDot,
  ClipboardList,
  Lightbulb,
  MessageSquare,
  Target,
} from "lucide-react";

import type { ActivityEventType } from "@/features/career-cases/types";

export function getActivityIcon(type: ActivityEventType): LucideIcon {
  switch (type) {
    case "career_case_created":
      return Briefcase;
    case "meeting_logged":
      return MessageSquare;
    case "observation_added":
      return ClipboardList;
    case "capability_created":
    case "capability_updated":
    case "capability_deleted":
      return Target;
    case "goal_added":
    case "goal_updated":
    case "goal_deleted":
      return Target;
    case "task_created":
    case "task_completed":
    case "task_deleted":
      return CheckCircle2;
    case "recommendation_added":
    case "recommendation_updated":
    case "recommendation_completed":
    case "recommendation_deleted":
      return Lightbulb;
    case "knowledge_created":
    case "knowledge_updated":
    case "knowledge_validated":
      return BookOpen;
    case "knowledge_archived":
      return Archive;
    default:
      return CircleDot;
  }
}

export function getActivityIconClassName(type: ActivityEventType) {
  switch (type) {
    case "capability_deleted":
    case "goal_deleted":
    case "task_deleted":
    case "recommendation_deleted":
    case "knowledge_archived":
      return "text-destructive";
    case "task_completed":
    case "recommendation_completed":
    case "knowledge_validated":
      return "text-primary";
    default:
      return "text-muted-foreground";
  }
}
