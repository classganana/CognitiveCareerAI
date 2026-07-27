import { goalFormSchema } from "@/features/goals/schemas/goal-form.schema";
import { getErrorMessage, jsonData, jsonError } from "@/lib/api/response";
import {
  createGoal,
  listGoalsByCareerCase,
} from "@/services/goal.service";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const goals = await listGoalsByCareerCase(id);
    return jsonData(goals);
  } catch (error) {
    return jsonError(getErrorMessage(error), 500);
  }
}

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const parsed = goalFormSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid request body", 400);
    }

    const goal = await createGoal(id, parsed.data);

    if (!goal) {
      return jsonError("Career case not found", 404);
    }

    return jsonData(goal, 201);
  } catch (error) {
    return jsonError(getErrorMessage(error), 500);
  }
}
