"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { CardGridSkeleton } from "@/components/layout/card-grid-skeleton";
import { EmptyPage } from "@/components/layout/empty-page";
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
import { GoalForm } from "@/features/goals/components/goal-form";
import { GoalProgressBar } from "@/features/goals/components/goal-progress-bar";
import type { SerializedGoalSummary } from "@/features/goals/lib/serialize-goal";
import {
  createGoal,
  deleteGoalApi,
  fetchGoals,
  updateGoal,
} from "@/features/goals/lib/goal-api";
import type { GoalFormValues } from "@/features/goals/schemas/goal-form.schema";
import { formatGoalPriority, formatGoalStatus } from "@/utils/goal-labels";
import { formatDate } from "@/utils/labels";

type GoalsTabProps = {
  careerCaseId: string;
};

function toDateInputValue(value: string | null) {
  if (!value) {
    return "";
  }

  return value.slice(0, 10);
}

export function GoalsTab({ careerCaseId }: GoalsTabProps) {
  const router = useRouter();
  const [goals, setGoals] = useState<SerializedGoalSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<SerializedGoalSummary | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SerializedGoalSummary | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadGoals = useCallback(async () => {
    try {
      const data = await fetchGoals(careerCaseId);
      setGoals(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load goals");
    } finally {
      setIsLoading(false);
    }
  }, [careerCaseId]);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  function closeDialog() {
    setDialogMode(null);
    setSelectedGoal(null);
  }

  async function handleCreate(values: GoalFormValues) {
    setIsSubmitting(true);

    try {
      await createGoal(careerCaseId, values);
      toast.success("Goal created");
      closeDialog();
      await loadGoals();
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create goal");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdate(values: GoalFormValues) {
    if (!selectedGoal) {
      return;
    }

    setIsSubmitting(true);

    try {
      await updateGoal(careerCaseId, selectedGoal._id, values);
      toast.success("Goal updated");
      closeDialog();
      await loadGoals();
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update goal");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteGoalApi(careerCaseId, deleteTarget._id);
      toast.success("Goal deleted");
      setDeleteTarget(null);
      await loadGoals();
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete goal");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setSelectedGoal(null);
            setDialogMode("create");
          }}
        >
          <Plus className="size-4" />
          Add Goal
        </Button>
      </div>

      {isLoading ? (
        <CardGridSkeleton count={2} />
      ) : goals.length === 0 ? (
        <EmptyPage
          title="No goals defined yet"
          description="Create development goals to turn capability assessments into action."
          action={{
            label: "Add Goal",
            onClick: () => {
              setSelectedGoal(null);
              setDialogMode("create");
            },
          }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {goals.map((goal) => (
            <Card key={goal._id}>
              <CardHeader className="gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base">{goal.title}</CardTitle>
                    <CardDescription>
                      {goal.totalTasks} task{goal.totalTasks === 1 ? "" : "s"}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Link href={`/career-cases/${careerCaseId}/goals/${goal._id}`}>
                      <Button variant="ghost" size="icon" aria-label="View goal">
                        <Eye className="size-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedGoal(goal);
                        setDialogMode("edit");
                      }}
                      aria-label="Edit goal"
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteTarget(goal)}
                      aria-label="Delete goal"
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{formatGoalPriority(goal.priority)}</Badge>
                  <Badge variant="secondary">{formatGoalStatus(goal.status)}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <GoalProgressBar progress={goal} />
                <p className="text-sm text-muted-foreground">
                  Target date:{" "}
                  {goal.targetDate ? formatDate(goal.targetDate) : "Not set"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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
              {dialogMode === "edit" ? "Edit Goal" : "Add Goal"}
            </DialogTitle>
          </DialogHeader>
          <GoalForm
            key={selectedGoal?._id ?? "create"}
            defaultValues={
              selectedGoal
                ? {
                    title: selectedGoal.title,
                    description: selectedGoal.description,
                    priority: selectedGoal.priority,
                    status: selectedGoal.status,
                    targetDate: toDateInputValue(selectedGoal.targetDate),
                  }
                : undefined
            }
            onSubmit={dialogMode === "edit" ? handleUpdate : handleCreate}
            onCancel={closeDialog}
            isSubmitting={isSubmitting}
            submitLabel={dialogMode === "edit" ? "Save Changes" : "Add Goal"}
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
            <DialogTitle>Delete goal</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {deleteTarget
              ? `Delete "${deleteTarget.title}" and all its tasks? This action cannot be undone.`
              : "Delete this goal?"}
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
