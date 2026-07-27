import { z } from "zod";

import { CAPABILITY_CATEGORIES, CapabilityCategory } from "@/types/domain/capability-category";
import { CAPABILITY_LEVELS, CapabilityLevel } from "@/types/enums";

export const capabilityFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  category: z.enum(
    CAPABILITY_CATEGORIES as [CapabilityCategory, ...CapabilityCategory[]],
  ),
  level: z.enum(CAPABILITY_LEVELS as [CapabilityLevel, ...CapabilityLevel[]]),
  confidence: z
    .number({ error: "Confidence is required" })
    .min(0, "Confidence must be at least 0")
    .max(100, "Confidence must be at most 100"),
  notes: z.string().trim().optional(),
  supportingObservations: z.array(z.string()),
});

export type CapabilityFormValues = z.infer<typeof capabilityFormSchema>;
