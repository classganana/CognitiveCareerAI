import { z } from "zod";

import { CAREER_STAGES, CareerStage } from "@/types/enums";
import { MENTEE_STATUSES, MenteeStatus } from "@/types/domain/mentee";

export const menteeFormSchema = z.object({
  fullName: z.string().trim().min(1, "Full name is required"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z.string().trim().min(1, "Phone is required"),
  currentRole: z.string().trim().min(1, "Current role is required"),
  targetRole: z.string().trim().min(1, "Target role is required"),
  careerStage: z.enum(CAREER_STAGES as [CareerStage, ...CareerStage[]]),
  yearsOfExperience: z
    .number({ error: "Years of experience is required" })
    .min(0, "Years of experience must be 0 or greater")
    .max(60, "Years of experience must be 60 or less"),
  notes: z.string().trim().optional(),
  status: z.enum(MENTEE_STATUSES as [MenteeStatus, ...MenteeStatus[]]),
});

export type MenteeFormValues = z.infer<typeof menteeFormSchema>;

export const createMenteeSchema = menteeFormSchema.omit({ status: true });

export type CreateMenteeFormValues = z.infer<typeof createMenteeSchema>;

export const updateMenteeSchema = menteeFormSchema;

export type UpdateMenteeFormValues = z.infer<typeof updateMenteeSchema>;
