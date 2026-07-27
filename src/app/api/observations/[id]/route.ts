import { observationFormSchema } from "@/features/meetings/schemas/observation-form.schema";
import { getErrorMessage, jsonData, jsonError } from "@/lib/api/response";
import { deleteObservation, updateObservation } from "@/services/meeting.service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = observationFormSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid request body", 400);
    }

    const observation = await updateObservation(id, parsed.data);

    if (!observation) {
      return jsonError("Observation not found", 404);
    }

    return jsonData(observation);
  } catch (error) {
    return jsonError(getErrorMessage(error), 500);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const deleted = await deleteObservation(id);

    if (!deleted) {
      return jsonError("Observation not found", 404);
    }

    return jsonData({ success: true });
  } catch (error) {
    return jsonError(getErrorMessage(error), 500);
  }
}
