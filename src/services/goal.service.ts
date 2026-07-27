import { Types } from "mongoose";

import {
  CareerCaseModel,
  GoalModel,
  MenteeModel,
  TaskModel,
} from "@/models";
import { connectToDatabase } from "@/lib/db/mongoose";
import { getDefaultMentorId } from "@/lib/mentor/default-mentor";
import type { GoalFormValues } from "@/features/goals/schemas/goal-form.schema";
import type { TaskFormValues } from "@/features/goals/schemas/task-form.schema";
import {
  calculateGoalProgress,
  serializeGoal,
  serializeTask,
  type SerializedGoal,
  type SerializedGoalDetail,
  type SerializedGoalSummary,
  type SerializedTask,
} from "@/features/goals/lib/serialize-goal";
import { isValidObjectId } from "@/features/mentees/lib/serialize-mentee";
import {
  ActivityEntityType,
  ActivityType,
} from "@/types/domain/activity-enums";
import { GoalStatus } from "@/types/domain/goal";
import { getDefaultActorName, logActivity } from "@/services/activity.service";

async function assertCareerCaseAccess(careerCaseId: string) {
  if (!isValidObjectId(careerCaseId)) {
    return null;
  }

  await connectToDatabase();
  const mentorId = await getDefaultMentorId();

  const careerCase = await CareerCaseModel.findById(careerCaseId);

  if (!careerCase) {
    return null;
  }

  const mentee = await MenteeModel.findOne({
    _id: careerCase.menteeId,
    mentorId,
  });

  if (!mentee) {
    return null;
  }

  return careerCase;
}

async function assertGoalAccess(careerCaseId: string, goalId: string) {
  const careerCase = await assertCareerCaseAccess(careerCaseId);

  if (!careerCase || !isValidObjectId(goalId)) {
    return null;
  }

  const goal = await GoalModel.findOne({
    _id: goalId,
    careerCaseId: careerCase._id,
  });

  if (!goal) {
    return null;
  }

  return { careerCase, goal };
}

function parseOptionalDate(value?: string) {
  if (!value?.trim()) {
    return undefined;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return undefined;
  }

  return date;
}

function toGoalPayload(values: GoalFormValues) {
  return {
    title: values.title,
    description: values.description,
    priority: values.priority,
    status: values.status,
    targetDate: parseOptionalDate(values.targetDate),
  };
}

function toTaskPayload(values: TaskFormValues) {
  return {
    title: values.title,
    description: values.description,
    dueDate: parseOptionalDate(values.dueDate),
    completed: values.completed,
  };
}

async function getTasksForGoals(goalIds: Types.ObjectId[]) {
  if (goalIds.length === 0) {
    return new Map<string, SerializedTask[]>();
  }

  const tasks = await TaskModel.find({ goalId: { $in: goalIds } }).sort({
    completed: 1,
    dueDate: 1,
    createdAt: 1,
  });

  const tasksByGoalId = new Map<string, SerializedTask[]>();

  for (const task of tasks) {
    const goalId = task.goalId.toString();
    const serialized = serializeTask(task);
    const existing = tasksByGoalId.get(goalId) ?? [];
    existing.push(serialized);
    tasksByGoalId.set(goalId, existing);
  }

  return tasksByGoalId;
}

export async function listGoalsByCareerCase(
  careerCaseId: string,
): Promise<SerializedGoalSummary[]> {
  const careerCase = await assertCareerCaseAccess(careerCaseId);

  if (!careerCase) {
    return [];
  }

  const goals = await GoalModel.find({ careerCaseId: careerCase._id }).sort({
    updatedAt: -1,
  });
  const tasksByGoalId = await getTasksForGoals(goals.map((goal) => goal._id));

  return goals.map((goal) => {
    const tasks = tasksByGoalId.get(goal._id.toString()) ?? [];
    const progress = calculateGoalProgress(tasks);

    return {
      ...serializeGoal(goal),
      ...progress,
    };
  });
}

export async function getGoalDetails(
  careerCaseId: string,
  goalId: string,
): Promise<SerializedGoalDetail | null> {
  const access = await assertGoalAccess(careerCaseId, goalId);

  if (!access) {
    return null;
  }

  const tasks = await TaskModel.find({ goalId: access.goal._id }).sort({
    completed: 1,
    dueDate: 1,
    createdAt: 1,
  });
  const serializedTasks = tasks.map(serializeTask);
  const progress = calculateGoalProgress(serializedTasks);

  return {
    ...serializeGoal(access.goal),
    progress,
    tasks: serializedTasks,
  };
}

export async function createGoal(
  careerCaseId: string,
  values: GoalFormValues,
): Promise<SerializedGoal | null> {
  const careerCase = await assertCareerCaseAccess(careerCaseId);

  if (!careerCase) {
    return null;
  }

  const goal = await GoalModel.create({
    ...toGoalPayload(values),
    careerCaseId: careerCase._id,
  });

  const actor = await getDefaultActorName();

  await logActivity({
    careerCaseId: careerCase._id,
    type: ActivityType.GoalCreated,
    title: "Goal Created",
    actor,
    entityType: ActivityEntityType.Goal,
    entityId: goal._id,
    metadata: {
      description: goal.title,
    },
  });

  return serializeGoal(goal);
}

export async function updateGoal(
  careerCaseId: string,
  goalId: string,
  values: GoalFormValues,
): Promise<SerializedGoal | null> {
  const access = await assertGoalAccess(careerCaseId, goalId);

  if (!access) {
    return null;
  }

  const goal = await GoalModel.findOneAndUpdate(
    { _id: goalId, careerCaseId: access.careerCase._id },
    { $set: toGoalPayload(values) },
    { new: true, runValidators: true },
  );

  if (!goal) {
    return null;
  }

  const actor = await getDefaultActorName();

  await logActivity({
    careerCaseId: access.careerCase._id,
    type: ActivityType.GoalUpdated,
    title: "Goal Updated",
    actor,
    entityType: ActivityEntityType.Goal,
    entityId: goal._id,
    metadata: {
      description: goal.title,
    },
  });

  return serializeGoal(goal);
}

export async function deleteGoal(
  careerCaseId: string,
  goalId: string,
): Promise<boolean> {
  const access = await assertGoalAccess(careerCaseId, goalId);

  if (!access) {
    return false;
  }

  await TaskModel.deleteMany({ goalId: access.goal._id });
  await GoalModel.findByIdAndDelete(access.goal._id);

  const actor = await getDefaultActorName();

  await logActivity({
    careerCaseId: access.careerCase._id,
    type: ActivityType.GoalDeleted,
    title: "Goal Deleted",
    actor,
    entityType: ActivityEntityType.Goal,
    entityId: access.goal._id,
    metadata: {
      description: access.goal.title,
    },
  });

  return true;
}

export async function createTask(
  careerCaseId: string,
  goalId: string,
  values: TaskFormValues,
): Promise<SerializedTask | null> {
  const access = await assertGoalAccess(careerCaseId, goalId);

  if (!access) {
    return null;
  }

  const task = await TaskModel.create({
    ...toTaskPayload(values),
    goalId: access.goal._id,
  });

  const actor = await getDefaultActorName();

  await logActivity({
    careerCaseId: access.careerCase._id,
    type: ActivityType.TaskCreated,
    title: "Task Created",
    actor,
    entityType: ActivityEntityType.Task,
    entityId: task._id,
    metadata: {
      description: task.title,
    },
  });

  if (task.completed) {
    await logActivity({
      careerCaseId: access.careerCase._id,
      type: ActivityType.TaskCompleted,
      title: "Task Completed",
      actor,
      entityType: ActivityEntityType.Task,
      entityId: task._id,
      metadata: {
        description: task.title,
      },
    });
  }

  return serializeTask(task);
}

export async function updateTask(
  careerCaseId: string,
  goalId: string,
  taskId: string,
  values: TaskFormValues,
): Promise<SerializedTask | null> {
  const access = await assertGoalAccess(careerCaseId, goalId);

  if (!access || !isValidObjectId(taskId)) {
    return null;
  }

  const existingTask = await TaskModel.findOne({
    _id: taskId,
    goalId: access.goal._id,
  });

  if (!existingTask) {
    return null;
  }

  const wasCompleted = existingTask.completed;

  const task = await TaskModel.findOneAndUpdate(
    { _id: taskId, goalId: access.goal._id },
    { $set: toTaskPayload(values) },
    { new: true, runValidators: true },
  );

  if (!task) {
    return null;
  }

  const actor = await getDefaultActorName();

  if (!wasCompleted && task.completed) {
    await logActivity({
      careerCaseId: access.careerCase._id,
      type: ActivityType.TaskCompleted,
      title: "Task Completed",
      actor,
      entityType: ActivityEntityType.Task,
      entityId: task._id,
      metadata: {
        description: task.title,
      },
    });
  }

  return serializeTask(task);
}

export async function deleteTask(
  careerCaseId: string,
  goalId: string,
  taskId: string,
): Promise<boolean> {
  const access = await assertGoalAccess(careerCaseId, goalId);

  if (!access || !isValidObjectId(taskId)) {
    return false;
  }

  const task = await TaskModel.findOne({
    _id: taskId,
    goalId: access.goal._id,
  });

  if (!task) {
    return false;
  }

  await TaskModel.findByIdAndDelete(task._id);

  const actor = await getDefaultActorName();

  await logActivity({
    careerCaseId: access.careerCase._id,
    type: ActivityType.TaskDeleted,
    title: "Task Deleted",
    actor,
    entityType: ActivityEntityType.Task,
    entityId: task._id,
    metadata: {
      description: task.title,
    },
  });

  return true;
}

export async function getGoalSnapshotStats(careerCaseId: string) {
  const careerCase = await assertCareerCaseAccess(careerCaseId);

  if (!careerCase) {
    return null;
  }

  const goals = await GoalModel.find({ careerCaseId: careerCase._id }).select(
    "_id status",
  );
  const goalIds = goals.map((goal) => goal._id);

  const activeGoals = goals.filter(
    (goal) => goal.status !== GoalStatus.COMPLETED,
  ).length;
  const completedGoals = goals.filter(
    (goal) => goal.status === GoalStatus.COMPLETED,
  ).length;

  let overallGoalProgress = 0;

  if (goalIds.length > 0) {
    const tasks = await TaskModel.find({ goalId: { $in: goalIds } }).select(
      "completed",
    );
    const progress = calculateGoalProgress(tasks);
    overallGoalProgress = progress.percentage;
  }

  return {
    activeGoals,
    completedGoals,
    overallGoalProgress,
  };
}
