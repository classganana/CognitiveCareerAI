import { z } from "zod";

import { SESSION_TYPES, SessionType } from "@/types/enums";

export const createMeetingSchema = z.object({
  sessionDate: z.string().min(1, "Session date is required"),
  sessionType: z.enum(SESSION_TYPES as [SessionType, ...SessionType[]]),
  durationMinutes: z
    .number({ error: "Duration is required" })
    .min(1, "Duration must be at least 1 minute")
    .max(480, "Duration must be 480 minutes or less"),
  summary: z.string().trim(),
});

export type CreateMeetingFormValues = z.infer<typeof createMeetingSchema>;
