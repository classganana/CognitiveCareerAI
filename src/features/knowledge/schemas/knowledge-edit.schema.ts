import { z } from "zod";

import {
  KNOWLEDGE_DOMAINS,
  KNOWLEDGE_VALIDATION_STATUSES,
  KnowledgeDomain,
  KnowledgeValidationStatus,
} from "@/types/domain/knowledge-domain";

export const knowledgeEditSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  summary: z.string().trim().min(1, "Summary is required"),
  domain: z.enum(KNOWLEDGE_DOMAINS as [KnowledgeDomain, ...KnowledgeDomain[]]),
  tags: z.array(z.string().trim()),
  confidence: z
    .number()
    .min(0, "Confidence must be at least 0")
    .max(100, "Confidence must be at most 100"),
  validationStatus: z.enum(
    KNOWLEDGE_VALIDATION_STATUSES as [
      KnowledgeValidationStatus,
      ...KnowledgeValidationStatus[],
    ],
  ),
});

export type KnowledgeEditValues = z.infer<typeof knowledgeEditSchema>;

export const addEvidenceSchema = z.object({
  observationId: z.string().min(1, "Observation is required"),
});

export type AddEvidenceValues = z.infer<typeof addEvidenceSchema>;
