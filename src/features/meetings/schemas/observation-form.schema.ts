import { z } from "zod";

import {
  OBSERVATION_CATEGORIES,
  OBSERVATION_SEVERITIES,
  ObservationCategory,
  ObservationSeverity,
} from "@/types/enums";

export const observationFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
  category: z.enum(
    OBSERVATION_CATEGORIES as [ObservationCategory, ...ObservationCategory[]],
  ),
  severity: z.enum(
    OBSERVATION_SEVERITIES as [ObservationSeverity, ...ObservationSeverity[]],
  ),
});

export type ObservationFormValues = z.infer<typeof observationFormSchema>;
