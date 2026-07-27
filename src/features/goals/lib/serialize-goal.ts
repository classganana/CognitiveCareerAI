import type { Goal } from "@/types/domain/goal";
import type { Task } from "@/types/domain/task";

export type SerializedGoal = {
  _id: string;
  careerCaseId: string;
  title: string;
  description: string;
  targetDate: string | null;
  status: Goal["status"];
  priority: Goal["priority"];
  createdAt: string;
  updatedAt: string;
};

export type GoalProgress = {
  completedTasks: number;
  totalTasks: number;
  percentage: number;
};

export type SerializedGoalSummary = SerializedGoal & GoalProgress;

export type SerializedTask = {
  _id: string;
  goalId: string;
  title: string;
  description: string;
  dueDate: string | null;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SerializedGoalDetail = SerializedGoal & {
  progress: GoalProgress;
  tasks: SerializedTask[];
};

export function serializeGoal(goal: Goal): SerializedGoal {
  return {
    _id: goal._id.toString(),
    careerCaseId: goal.careerCaseId.toString(),
    title: goal.title,
    description: goal.description,
    targetDate: goal.targetDate?.toISOString() ?? null,
    status: goal.status,
    priority: goal.priority,
    createdAt: goal.createdAt.toISOString(),
    updatedAt: goal.updatedAt.toISOString(),
  };
}

export function serializeTask(task: Task): SerializedTask {
  return {
    _id: task._id.toString(),
    goalId: task.goalId.toString(),
    title: task.title,
    description: task.description,
    dueDate: task.dueDate?.toISOString() ?? null,
    completed: task.completed,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}

export function calculateGoalProgress(tasks: Pick<SerializedTask, "completed">[]): GoalProgress {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const percentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return { completedTasks, totalTasks, percentage };
}
