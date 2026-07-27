import type {
  SerializedGoal,
  SerializedGoalDetail,
  SerializedGoalSummary,
  SerializedTask,
} from "@/features/goals/lib/serialize-goal";
import type { GoalFormValues } from "@/features/goals/schemas/goal-form.schema";
import type { TaskFormValues } from "@/features/goals/schemas/task-form.schema";

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error ?? "Request failed");
  }

  return payload.data as T;
}

export async function fetchGoals(
  careerCaseId: string,
): Promise<SerializedGoalSummary[]> {
  const response = await fetch(`/api/career-cases/${careerCaseId}/goals`);
  return parseResponse<SerializedGoalSummary[]>(response);
}

export async function fetchGoalDetails(
  careerCaseId: string,
  goalId: string,
): Promise<SerializedGoalDetail> {
  const response = await fetch(
    `/api/career-cases/${careerCaseId}/goals/${goalId}`,
  );

  return parseResponse<SerializedGoalDetail>(response);
}

export async function createGoal(
  careerCaseId: string,
  values: GoalFormValues,
): Promise<SerializedGoal> {
  const response = await fetch(`/api/career-cases/${careerCaseId}/goals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  return parseResponse<SerializedGoal>(response);
}

export async function updateGoal(
  careerCaseId: string,
  goalId: string,
  values: GoalFormValues,
): Promise<SerializedGoal> {
  const response = await fetch(
    `/api/career-cases/${careerCaseId}/goals/${goalId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    },
  );

  return parseResponse<SerializedGoal>(response);
}

export async function deleteGoalApi(
  careerCaseId: string,
  goalId: string,
): Promise<void> {
  const response = await fetch(
    `/api/career-cases/${careerCaseId}/goals/${goalId}`,
    { method: "DELETE" },
  );

  await parseResponse<{ success: boolean }>(response);
}

export async function createTask(
  careerCaseId: string,
  goalId: string,
  values: TaskFormValues,
): Promise<SerializedTask> {
  const response = await fetch(
    `/api/career-cases/${careerCaseId}/goals/${goalId}/tasks`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    },
  );

  return parseResponse<SerializedTask>(response);
}

export async function updateTask(
  careerCaseId: string,
  goalId: string,
  taskId: string,
  values: TaskFormValues,
): Promise<SerializedTask> {
  const response = await fetch(
    `/api/career-cases/${careerCaseId}/goals/${goalId}/tasks/${taskId}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    },
  );

  return parseResponse<SerializedTask>(response);
}

export async function deleteTaskApi(
  careerCaseId: string,
  goalId: string,
  taskId: string,
): Promise<void> {
  const response = await fetch(
    `/api/career-cases/${careerCaseId}/goals/${goalId}/tasks/${taskId}`,
    { method: "DELETE" },
  );

  await parseResponse<{ success: boolean }>(response);
}
