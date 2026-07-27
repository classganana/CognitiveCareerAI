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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RecommendationDashboard } from "@/features/recommendations/components/recommendation-dashboard";
import { RecommendationForm } from "@/features/recommendations/components/recommendation-form";
import type {
  RecommendationDashboardStats,
  SerializedRecommendationSummary,
} from "@/features/recommendations/lib/serialize-recommendation";
import {
  createRecommendation,
  deleteRecommendationApi,
  fetchRecommendationDashboardStats,
  fetchRecommendations,
  updateRecommendation,
} from "@/features/recommendations/lib/recommendation-api";
import type { RecommendationFormValues } from "@/features/recommendations/schemas/recommendation-form.schema";
import { RECOMMENDATION_STATUSES } from "@/types/domain/recommendation";
import {
  formatRecommendationPriority,
  formatRecommendationStatus,
} from "@/utils/recommendation-labels";
import { formatDate } from "@/utils/labels";

type RecommendationsTabProps = {
  careerCaseId: string;
};

export function RecommendationsTab({ careerCaseId }: RecommendationsTabProps) {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<
    SerializedRecommendationSummary[]
  >([]);
  const [stats, setStats] = useState<RecommendationDashboardStats>({
    activeRecommendations: 0,
    completedRecommendations: 0,
    completionRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | null>(null);
  const [selectedRecommendation, setSelectedRecommendation] =
    useState<SerializedRecommendationSummary | null>(null);
  const [deleteTarget, setDeleteTarget] =
    useState<SerializedRecommendationSummary | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  const loadRecommendations = useCallback(async () => {
    try {
      const [data, dashboardStats] = await Promise.all([
        fetchRecommendations(careerCaseId),
        fetchRecommendationDashboardStats(careerCaseId),
      ]);
      setRecommendations(data);
      setStats(dashboardStats);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load recommendations",
      );
    } finally {
      setIsLoading(false);
    }
  }, [careerCaseId]);

  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  function closeDialog() {
    setDialogMode(null);
    setSelectedRecommendation(null);
  }

  async function handleCreate(values: RecommendationFormValues) {
    setIsSubmitting(true);

    try {
      await createRecommendation(careerCaseId, values);
      toast.success("Recommendation created");
      closeDialog();
      await loadRecommendations();
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create recommendation",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdate(values: RecommendationFormValues) {
    if (!selectedRecommendation) {
      return;
    }

    setIsSubmitting(true);

    try {
      await updateRecommendation(careerCaseId, selectedRecommendation._id, values);
      toast.success("Recommendation updated");
      closeDialog();
      await loadRecommendations();
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update recommendation",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleStatusChange(
    recommendation: SerializedRecommendationSummary,
    status: RecommendationFormValues["status"],
  ) {
    setUpdatingStatusId(recommendation._id);

    try {
      await updateRecommendation(careerCaseId, recommendation._id, {
        title: recommendation.title,
        description: recommendation.description,
        priority: recommendation.priority,
        status,
        capabilityId: recommendation.capabilityId ?? "",
        goalId: recommendation.goalId ?? "",
      });
      toast.success("Status updated");
      await loadRecommendations();
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update status",
      );
    } finally {
      setUpdatingStatusId(null);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteRecommendationApi(careerCaseId, deleteTarget._id);
      toast.success("Recommendation deleted");
      setDeleteTarget(null);
      await loadRecommendations();
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete recommendation",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <RecommendationDashboard stats={stats} />

      <div className="flex justify-end">
        <Button
          onClick={() => {
            setSelectedRecommendation(null);
            setDialogMode("create");
          }}
        >
          <Plus className="size-4" />
          Add Recommendation
        </Button>
      </div>

      {isLoading ? (
        <CardGridSkeleton count={2} />
      ) : recommendations.length === 0 ? (
        <EmptyPage
          title="No recommendations yet"
          description="Add coaching recommendations based on observations, capabilities, and goals."
          action={{
            label: "Add Recommendation",
            onClick: () => {
              setSelectedRecommendation(null);
              setDialogMode("create");
            },
          }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {recommendations.map((recommendation) => (
            <Card key={recommendation._id}>
              <CardHeader className="gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base">{recommendation.title}</CardTitle>
                    <CardDescription>
                      Created {formatDate(recommendation.createdAt)}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Link
                      href={`/career-cases/${careerCaseId}/recommendations/${recommendation._id}`}
                    >
                      <Button variant="ghost" size="icon" aria-label="View recommendation">
                        <Eye className="size-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedRecommendation(recommendation);
                        setDialogMode("edit");
                      }}
                      aria-label="Edit recommendation"
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteTarget(recommendation)}
                      aria-label="Delete recommendation"
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">
                    {formatRecommendationPriority(recommendation.priority)}
                  </Badge>
                  <Select
                    value={recommendation.status}
                    onValueChange={(value) =>
                      handleStatusChange(
                        recommendation,
                        value as RecommendationFormValues["status"],
                      )
                    }
                    disabled={updatingStatusId === recommendation._id}
                  >
                    <SelectTrigger className="h-7 w-auto gap-1 border-none bg-secondary px-2 shadow-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {RECOMMENDATION_STATUSES.map((status) => (
                        <SelectItem key={status} value={status}>
                          {formatRecommendationStatus(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="grid gap-2 text-sm text-muted-foreground">
                <p>
                  Related capability:{" "}
                  {recommendation.relatedCapabilityName ?? "None"}
                </p>
                <p>
                  Related goal: {recommendation.relatedGoalTitle ?? "None"}
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
              {dialogMode === "edit" ? "Edit Recommendation" : "Add Recommendation"}
            </DialogTitle>
          </DialogHeader>
          <RecommendationForm
            key={selectedRecommendation?._id ?? "create"}
            careerCaseId={careerCaseId}
            defaultValues={
              selectedRecommendation
                ? {
                    title: selectedRecommendation.title,
                    description: selectedRecommendation.description,
                    priority: selectedRecommendation.priority,
                    status: selectedRecommendation.status,
                    capabilityId: selectedRecommendation.capabilityId ?? "",
                    goalId: selectedRecommendation.goalId ?? "",
                  }
                : undefined
            }
            onSubmit={dialogMode === "edit" ? handleUpdate : handleCreate}
            onCancel={closeDialog}
            isSubmitting={isSubmitting}
            submitLabel={
              dialogMode === "edit" ? "Save Changes" : "Add Recommendation"
            }
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
            <DialogTitle>Delete recommendation</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {deleteTarget
              ? `Delete "${deleteTarget.title}"? This action cannot be undone.`
              : "Delete this recommendation?"}
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
