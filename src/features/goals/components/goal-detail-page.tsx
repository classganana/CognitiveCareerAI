"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Circle, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { GoalProgressBar } from "@/features/goals/components/goal-progress-bar";
import { TaskForm } from "@/features/goals/components/task-form";
import type { SerializedGoalDetail, SerializedTask } from "@/features/goals/lib/serialize-goal";
import {
  createTask,
  deleteTaskApi,
  updateTask,
} from "@/features/goals/lib/goal-api";
import type { TaskFormValues } from "@/features/goals/schemas/task-form.schema";
import { formatGoalPriority, formatGoalStatus } from "@/utils/goal-labels";
import { formatDate } from "@/utils/labels";

type GoalDetailPageProps = {
  careerCaseId: string;
  goal: SerializedGoalDetail;
};

function toDateInputValue(value: string | null) {
  if (!value) {
    return "";
  }

  return value.slice(0, 10);
}

export function GoalDetailPage({ careerCaseId, goal: initialGoal }: GoalDetailPageProps) {
  const router = useRouter();
  const [goal, setGoal] = useState(initialGoal);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | null>(null);
  const [selectedTask, setSelectedTask] = useState<SerializedTask | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SerializedTask | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingTaskId, setTogglingTaskId] = useState<string | null>(null);

  function closeDialog() {
    setDialogMode(null);
    setSelectedTask(null);
  }

  function updateGoalState(tasks: SerializedTask[]) {
    const completedTasks = tasks.filter((task) => task.completed).length;
    const totalTasks = tasks.length;
    const percentage =
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    setGoal((current) => ({
      ...current,
      tasks,
      progress: { completedTasks, totalTasks, percentage },
    }));
  }

  async function handleCreateTask(values: TaskFormValues) {
    setIsSubmitting(true);

    try {
      const task = await createTask(careerCaseId, goal._id, values);
      toast.success("Task created");
      closeDialog();
      updateGoalState([...goal.tasks, task]);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdateTask(values: TaskFormValues) {
    if (!selectedTask) {
      return;
    }

    setIsSubmitting(true);

    try {
      const task = await updateTask(
        careerCaseId,
        goal._id,
        selectedTask._id,
        values,
      );
      toast.success("Task updated");
      closeDialog();
      updateGoalState(
        goal.tasks.map((existing) =>
          existing._id === task._id ? task : existing,
        ),
      );
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update task");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleToggleComplete(task: SerializedTask) {
    setTogglingTaskId(task._id);

    try {
      const updated = await updateTask(careerCaseId, goal._id, task._id, {
        title: task.title,
        description: task.description,
        dueDate: toDateInputValue(task.dueDate),
        completed: !task.completed,
      });

      updateGoalState(
        goal.tasks.map((existing) =>
          existing._id === updated._id ? updated : existing,
        ),
      );
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update task status",
      );
    } finally {
      setTogglingTaskId(null);
    }
  }

  async function handleDeleteTask() {
    if (!deleteTarget) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteTaskApi(careerCaseId, goal._id, deleteTarget._id);
      toast.success("Task deleted");
      setDeleteTarget(null);
      updateGoalState(goal.tasks.filter((task) => task._id !== deleteTarget._id));
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete task");
    } finally {
      setIsDeleting(false);
    }
  }

  const outstandingTasks = goal.tasks.filter((task) => !task.completed);
  const completedTasks = goal.tasks.filter((task) => task.completed);

  function renderTaskRow(task: SerializedTask) {
    return (
      <div
        key={task._id}
        className="flex flex-wrap items-start justify-between gap-3 rounded-lg border p-4"
      >
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0"
            onClick={() => handleToggleComplete(task)}
            disabled={togglingTaskId === task._id}
            aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
          >
            {task.completed ? (
              <CheckCircle2 className="size-5 text-primary" />
            ) : (
              <Circle className="size-5 text-muted-foreground" />
            )}
          </Button>
          <div className="min-w-0 space-y-1">
            <p
              className={`font-medium ${task.completed ? "text-muted-foreground line-through" : ""}`}
            >
              {task.title}
            </p>
            <p className="text-sm text-muted-foreground">{task.description}</p>
            {task.dueDate ? (
              <p className="text-xs text-muted-foreground">
                Due {formatDate(task.dueDate)}
              </p>
            ) : null}
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSelectedTask(task);
              setDialogMode("edit");
            }}
            aria-label="Edit task"
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDeleteTarget(task)}
            aria-label="Delete task"
          >
            <Trash2 className="size-4 text-destructive" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href={`/career-cases/${careerCaseId}?tab=goals`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="size-4" />
            Back to Goals
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="gap-3">
          <CardTitle>{goal.title}</CardTitle>
          <CardDescription>Development goal and action plan</CardDescription>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{formatGoalPriority(goal.priority)}</Badge>
            <Badge variant="secondary">{formatGoalStatus(goal.status)}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm whitespace-pre-wrap text-muted-foreground">
            {goal.description}
          </p>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">Target Date</dt>
              <dd className="font-medium">
                {goal.targetDate ? formatDate(goal.targetDate) : "Not set"}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Tasks</dt>
              <dd className="font-medium">{goal.progress.totalTasks}</dd>
            </div>
          </dl>
          <GoalProgressBar progress={goal.progress} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>
              Concrete actions to achieve this goal
            </CardDescription>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setSelectedTask(null);
              setDialogMode("create");
            }}
          >
            <Plus className="size-4" />
            Add Task
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {goal.tasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No tasks yet. Add tasks to build an action plan for this goal.
            </p>
          ) : (
            <>
              <div className="space-y-3">
                <div>
                  <h3 className="font-medium">Outstanding Tasks</h3>
                  <p className="text-sm text-muted-foreground">
                    Actions still to be completed
                  </p>
                </div>
                {outstandingTasks.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    All tasks are complete.
                  </p>
                ) : (
                  outstandingTasks.map(renderTaskRow)
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <h3 className="font-medium">Completed Tasks</h3>
                  <p className="text-sm text-muted-foreground">
                    Actions already finished
                  </p>
                </div>
                {completedTasks.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No completed tasks yet.
                  </p>
                ) : (
                  completedTasks.map(renderTaskRow)
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={dialogMode !== null}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "edit" ? "Edit Task" : "Add Task"}
            </DialogTitle>
          </DialogHeader>
          <TaskForm
            key={selectedTask?._id ?? "create"}
            defaultValues={
              selectedTask
                ? {
                    title: selectedTask.title,
                    description: selectedTask.description,
                    dueDate: toDateInputValue(selectedTask.dueDate),
                    completed: selectedTask.completed,
                  }
                : undefined
            }
            onSubmit={dialogMode === "edit" ? handleUpdateTask : handleCreateTask}
            onCancel={closeDialog}
            isSubmitting={isSubmitting}
            submitLabel={dialogMode === "edit" ? "Save Changes" : "Add Task"}
            showCompletedField={dialogMode === "edit"}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete task</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {deleteTarget
              ? `Delete "${deleteTarget.title}"? This action cannot be undone.`
              : "Delete this task?"}
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteTask} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
