import { goalFormSchema } from "@/features/goals/schemas/goal-form.schema";
import { getErrorMessage, jsonData, jsonError } from "@/lib/api/response";
import {
  deleteGoal,
  getGoalDetails,
  updateGoal,
} from "@/services/goal.service";

type RouteContext = {
  params: Promise<{ id: string; goalId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id, goalId } = await context.params;
    const goal = await getGoalDetails(id, goalId);

    if (!goal) {
      return jsonError("Goal not found", 404);
    }

    return jsonData(goal);
  } catch (error) {
    return jsonError(getErrorMessage(error), 500);
  }
}

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id, goalId } = await context.params;
    const body = await request.json();
    const parsed = goalFormSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid request body", 400);
    }

    const goal = await updateGoal(id, goalId, parsed.data);

    if (!goal) {
      return jsonError("Goal not found", 404);
    }

    return jsonData(goal);
  } catch (error) {
    return jsonError(getErrorMessage(error), 500);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id, goalId } = await context.params;
    const deleted = await deleteGoal(id, goalId);

    if (!deleted) {
      return jsonError("Goal not found", 404);
    }

    return jsonData({ success: true });
  } catch (error) {
    return jsonError(getErrorMessage(error), 500);
  }
}
