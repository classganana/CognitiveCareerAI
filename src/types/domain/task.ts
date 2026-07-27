import type { Types } from "mongoose";

import type { BaseEntity } from "./base";

export interface Task extends BaseEntity {
  goalId: Types.ObjectId;
  title: string;
  description: string;
  dueDate?: Date;
  completed: boolean;
}

export type CreateTaskInput = Pick<Task, "goalId" | "title" | "description"> &
  Partial<Pick<Task, "dueDate" | "completed">>;

export type UpdateTaskInput = Partial<CreateTaskInput>;

export type TaskReference = Types.ObjectId | Task;
