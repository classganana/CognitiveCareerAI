import { observationFormSchema } from "@/features/meetings/schemas/observation-form.schema";
import { getErrorMessage, jsonData, jsonError } from "@/lib/api/response";
import { createObservation } from "@/services/meeting.service";

type RouteContext = {
  params: Promise<{ meetingId: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const { meetingId } = await context.params;
    const body = await request.json();
    const parsed = observationFormSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid request body", 400);
    }

    const observation = await createObservation(meetingId, parsed.data);

    if (!observation) {
      return jsonError("Session not found", 404);
    }

    return jsonData(observation, 201);
  } catch (error) {
    return jsonError(getErrorMessage(error), 500);
  }
}
