import { promoteObservationSchema } from "@/features/knowledge/schemas/promote-observation.schema";
import { getErrorMessage, jsonData, jsonError } from "@/lib/api/response";
import { promoteObservation } from "@/services/knowledge.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = promoteObservationSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid request body", 400);
    }

    const claim = await promoteObservation(parsed.data);

    if (!claim) {
      return jsonError("Observation not found or already promoted", 404);
    }

    return jsonData(claim, 201);
  } catch (error) {
    return jsonError(getErrorMessage(error), 500);
  }
}
