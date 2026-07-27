"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { EmptyPage } from "@/components/layout/empty-page";
import { Button } from "@/components/ui/button";
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
import { PromoteObservationForm } from "@/features/knowledge/components/promote-observation-form";
import { fetchObservationPromotionMap, promoteObservation } from "@/features/knowledge/lib/knowledge-api";
import { ObservationCard } from "@/features/meetings/components/observation-card";
import { ObservationForm } from "@/features/meetings/components/observation-form";
import type { SerializedObservation } from "@/features/meetings/lib/serialize-meeting";
import {
  createObservation,
  deleteObservationApi,
  updateObservation,
} from "@/features/meetings/lib/meeting-api";
import type { ObservationFormValues } from "@/features/meetings/schemas/observation-form.schema";

type SessionObservationsProps = {
  meetingId: string;
  initialObservations: SerializedObservation[];
};

export function SessionObservations({
  meetingId,
  initialObservations,
}: SessionObservationsProps) {
  const router = useRouter();
  const [observations, setObservations] = useState(initialObservations);
  const [promotionMap, setPromotionMap] = useState<Record<string, string>>({});
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | null>(null);
  const [promoteTarget, setPromoteTarget] = useState<SerializedObservation | null>(null);
  const [selectedObservation, setSelectedObservation] =
    useState<SerializedObservation | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SerializedObservation | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPromoting, setIsPromoting] = useState(false);

  const loadPromotionMap = useCallback(async (items: SerializedObservation[]) => {
    if (items.length === 0) {
      setPromotionMap({});
      return;
    }

    try {
      const map = await fetchObservationPromotionMap(items.map((item) => item._id));
      setPromotionMap(map);
    } catch {
      setPromotionMap({});
    }
  }, []);

  useEffect(() => {
    loadPromotionMap(initialObservations);
  }, [initialObservations, loadPromotionMap]);

  function closeDialog() {
    setDialogMode(null);
    setSelectedObservation(null);
  }

  async function handleCreate(values: ObservationFormValues) {
    setIsSubmitting(true);

    try {
      const observation = await createObservation(meetingId, values);
      const nextObservations = [observation, ...observations];
      setObservations(nextObservations);
      await loadPromotionMap(nextObservations);
      toast.success("Observation added");
      closeDialog();
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add observation",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdate(values: ObservationFormValues) {
    if (!selectedObservation) {
      return;
    }

    setIsSubmitting(true);

    try {
      const observation = await updateObservation(selectedObservation._id, values);
      const nextObservations = observations.map((item) =>
        item._id === observation._id ? observation : item,
      );
      setObservations(nextObservations);
      toast.success("Observation updated");
      closeDialog();
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update observation",
      );
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
      await deleteObservationApi(deleteTarget._id);
      const nextObservations = observations.filter(
        (item) => item._id !== deleteTarget._id,
      );
      setObservations(nextObservations);
      await loadPromotionMap(nextObservations);
      toast.success("Observation deleted");
      setDeleteTarget(null);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete observation",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  async function handlePromote(values: {
    observationId: string;
    title: string;
    summary: string;
    domain: import("@/types/domain/knowledge-domain").KnowledgeDomain;
    tags: string[];
  }) {
    setIsPromoting(true);

    try {
      const claim = await promoteObservation(values);
      setPromotionMap((current) => ({
        ...current,
        [values.observationId]: claim._id,
      }));
      toast.success("Observation promoted to knowledge");
      setPromoteTarget(null);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to promote observation",
      );
    } finally {
      setIsPromoting(false);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div>
          <CardTitle>Observations</CardTitle>
          <CardDescription>
            Structured notes captured during this mentoring session
          </CardDescription>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setSelectedObservation(null);
            setDialogMode("create");
          }}
        >
          <Plus className="size-4" />
          Add Observation
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {observations.length === 0 ? (
          <EmptyPage
            title="No observations recorded yet"
            description="Capture structured notes during this mentoring session."
            action={{
              label: "Add Observation",
              onClick: () => {
                setSelectedObservation(null);
                setDialogMode("create");
              },
            }}
          />
        ) : (
          observations.map((observation) => (
            <ObservationCard
              key={observation._id}
              observation={observation}
              knowledgeClaimId={promotionMap[observation._id]}
              onEdit={(item) => {
                setSelectedObservation(item);
                setDialogMode("edit");
              }}
              onDelete={setDeleteTarget}
              onPromote={setPromoteTarget}
            />
          ))
        )}
      </CardContent>

      <Dialog
        open={dialogMode !== null}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "edit" ? "Edit Observation" : "Add Observation"}
            </DialogTitle>
          </DialogHeader>
          <ObservationForm
            key={selectedObservation?._id ?? "create"}
            defaultValues={
              selectedObservation
                ? {
                    title: selectedObservation.title,
                    description: selectedObservation.description,
                    category: selectedObservation.category,
                    severity: selectedObservation.severity,
                  }
                : undefined
            }
            onSubmit={dialogMode === "edit" ? handleUpdate : handleCreate}
            onCancel={closeDialog}
            isSubmitting={isSubmitting}
            submitLabel={dialogMode === "edit" ? "Save Changes" : "Add Observation"}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!promoteTarget}
        onOpenChange={(open) => {
          if (!open) {
            setPromoteTarget(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Promote to Knowledge</DialogTitle>
          </DialogHeader>
          {promoteTarget ? (
            <PromoteObservationForm
              key={promoteTarget._id}
              observationId={promoteTarget._id}
              defaultTitle={promoteTarget.title}
              onSubmit={handlePromote}
              onCancel={() => setPromoteTarget(null)}
              isSubmitting={isPromoting}
            />
          ) : null}
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
            <DialogTitle>Delete observation</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {deleteTarget
              ? `Delete "${deleteTarget.title}"? This action cannot be undone.`
              : "Delete this observation?"}
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
    </Card>
  );
}
