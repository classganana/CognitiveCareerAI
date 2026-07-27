import { taskFormSchema } from "@/features/goals/schemas/task-form.schema";
import { getErrorMessage, jsonData, jsonError } from "@/lib/api/response";
import { deleteTask, updateTask } from "@/services/goal.service";

type RouteContext = {
  params: Promise<{ id: string; goalId: string; taskId: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id, goalId, taskId } = await context.params;
    const body = await request.json();
    const parsed = taskFormSchema.safeParse(body);

    if (!parsed.success) {
      return jsonError(parsed.error.issues[0]?.message ?? "Invalid request body", 400);
    }

    const task = await updateTask(id, goalId, taskId, parsed.data);

    if (!task) {
      return jsonError("Task not found", 404);
    }

    return jsonData(task);
  } catch (error) {
    return jsonError(getErrorMessage(error), 500);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { id, goalId, taskId } = await context.params;
    const deleted = await deleteTask(id, goalId, taskId);

    if (!deleted) {
      return jsonError("Task not found", 404);
    }

    return jsonData({ success: true });
  } catch (error) {
    return jsonError(getErrorMessage(error), 500);
  }
}
