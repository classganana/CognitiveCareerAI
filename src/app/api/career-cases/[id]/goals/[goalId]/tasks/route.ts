import { taskFormSchema } from "@/features/goals/schemas/task-form.schema";
import { getErrorMessage, jsonData, jsonError } from "@/lib/api/response";
import { createTask } from "@/services/goal.service";

type RouteContext = {
  params: Promise<{ id: string; goalId: string }>;
};

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id, goalId } = await context.params;
    const body = await request.json();
    const parsed = taskFormSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid request body", 400);
    }

    const task = await createTask(id, goalId, parsed.data);

    if (!task) {
      return jsonError("Goal not found", 404);
    }

    return jsonData(task, 201);
  } catch (error) {
    return jsonError(getErrorMessage(error), 500);
  }
}
