import { updateMenteeSchema } from "@/features/mentees/schemas/mentee-form.schema";
import { getErrorMessage, jsonData, jsonError } from "@/lib/api/response";
import {
  deleteMenteeWithRelatedData,
  getMenteeById,
  updateMentee,
} from "@/services/mentee.service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const result = await getMenteeById(id);

    if (!result) {
      return jsonError("Mentee not found", 404);
    }

    return jsonData(result);
  } catch (error) {
    return jsonError(getErrorMessage(error), 500);
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = updateMenteeSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid request body", 400);
    }

    const mentee = await updateMentee(id, parsed.data);

    if (!mentee) {
      return jsonError("Mentee not found", 404);
    }

    return jsonData(mentee);
  } catch (error) {
    return jsonError(getErrorMessage(error), 500);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const deleted = await deleteMenteeWithRelatedData(id);

    if (!deleted) {
      return jsonError("Mentee not found", 404);
    }

    return jsonData({ success: true });
  } catch (error) {
    return jsonError(getErrorMessage(error), 500);
  }
}
