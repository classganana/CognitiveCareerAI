import { z } from "zod";

import {
  KNOWLEDGE_DOMAINS,
  KnowledgeDomain,
} from "@/types/domain/knowledge-domain";

export const promoteObservationSchema = z.object({
  observationId: z.string().min(1, "Observation is required"),
  title: z.string().trim().min(1, "Title is required"),
  summary: z.string().trim().min(1, "Summary is required"),
  domain: z.enum(KNOWLEDGE_DOMAINS as [KnowledgeDomain, ...KnowledgeDomain[]]),
  tags: z.array(z.string().trim()),
});

export type PromoteObservationValues = z.infer<typeof promoteObservationSchema>;
