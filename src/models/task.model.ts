import { Schema, model, models, type Model } from "mongoose";

import type { Task } from "@/types/domain/task";

import { defaultSchemaOptions, objectIdRef } from "./shared";

const TaskSchema = new Schema<Task>(
  {
    goalId: objectIdRef("Goal"),
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    dueDate: {
      type: Date,
    },
    completed: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  defaultSchemaOptions,
);

TaskSchema.index({ goalId: 1 });
TaskSchema.index({ completed: 1 });
TaskSchema.index({ dueDate: 1 }, { sparse: true });

export const TaskModel: Model<Task> =
  models.Task ?? model<Task>("Task", TaskSchema);
