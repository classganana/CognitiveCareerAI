"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CardGridSkeleton } from "@/components/layout/card-grid-skeleton";
import { EmptyPage } from "@/components/layout/empty-page";
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
import { CapabilityForm } from "@/features/capabilities/components/capability-form";
import type { SerializedCapabilitySummary } from "@/features/capabilities/lib/serialize-capability";
import {
  createCapability,
  deleteCapabilityApi,
  fetchCapabilities,
  updateCapability,
} from "@/features/capabilities/lib/capability-api";
import type { CapabilityFormValues } from "@/features/capabilities/schemas/capability-form.schema";
import {
  formatCapabilityCategory,
  formatCapabilityLevel,
} from "@/utils/capability-labels";
import { formatDate } from "@/utils/labels";

type CapabilitiesTabProps = {
  careerCaseId: string;
};

export function CapabilitiesTab({ careerCaseId }: CapabilitiesTabProps) {
  const router = useRouter();
  const [capabilities, setCapabilities] = useState<SerializedCapabilitySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | null>(null);
  const [selectedCapability, setSelectedCapability] =
    useState<SerializedCapabilitySummary | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SerializedCapabilitySummary | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadCapabilities = useCallback(async () => {
    try {
      const data = await fetchCapabilities(careerCaseId);
      setCapabilities(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load capabilities",
      );
    } finally {
      setIsLoading(false);
    }
  }, [careerCaseId]);

  useEffect(() => {
    loadCapabilities();
  }, [loadCapabilities]);

  function closeDialog() {
    setDialogMode(null);
    setSelectedCapability(null);
  }

  async function handleCreate(values: CapabilityFormValues) {
    setIsSubmitting(true);

    try {
      await createCapability(careerCaseId, values);
      toast.success("Capability created");
      closeDialog();
      await loadCapabilities();
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create capability",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleUpdate(values: CapabilityFormValues) {
    if (!selectedCapability) {
      return;
    }

    setIsSubmitting(true);

    try {
      await updateCapability(careerCaseId, selectedCapability._id, values);
      toast.success("Capability updated");
      closeDialog();
      await loadCapabilities();
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update capability",
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
      await deleteCapabilityApi(careerCaseId, deleteTarget._id);
      toast.success("Capability deleted");
      setDeleteTarget(null);
      await loadCapabilities();
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete capability",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setSelectedCapability(null);
            setDialogMode("create");
          }}
        >
          <Plus className="size-4" />
          Add Capability
        </Button>
      </div>

      {isLoading ? (
        <CardGridSkeleton count={2} />
      ) : capabilities.length === 0 ? (
        <EmptyPage
          title="No capabilities assessed yet"
          description="Add capabilities to build a structured view of the mentee's skills."
          action={{
            label: "Add Capability",
            onClick: () => {
              setSelectedCapability(null);
              setDialogMode("create");
            },
          }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {capabilities.map((capability) => (
            <Card key={capability._id}>
              <CardHeader className="gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base">{capability.name}</CardTitle>
                    <CardDescription>
                      {formatCapabilityCategory(capability.category)}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Link href={`/career-cases/${careerCaseId}/capabilities/${capability._id}`}>
                      <Button variant="ghost" size="icon" aria-label="View capability">
                        <Eye className="size-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedCapability(capability);
                        setDialogMode("edit");
                      }}
                      aria-label="Edit capability"
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteTarget(capability)}
                      aria-label="Delete capability"
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">
                    {formatCapabilityLevel(capability.level)}
                  </Badge>
                  <Badge variant="secondary">{capability.confidence}% confidence</Badge>
                </div>
              </CardHeader>
              <CardContent className="grid gap-2 text-sm text-muted-foreground">
                <p>
                  Last reviewed:{" "}
                  {capability.lastReviewedAt
                    ? formatDate(capability.lastReviewedAt)
                    : "Not reviewed"}
                </p>
                <p>
                  Supporting observations: {capability.supportingObservationsCount}
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
              {dialogMode === "edit" ? "Edit Capability" : "Add Capability"}
            </DialogTitle>
          </DialogHeader>
          <CapabilityForm
            key={selectedCapability?._id ?? "create"}
            careerCaseId={careerCaseId}
            defaultValues={
              selectedCapability
                ? {
                    name: selectedCapability.name,
                    category: selectedCapability.category,
                    level: selectedCapability.level,
                    confidence: selectedCapability.confidence,
                    notes: selectedCapability.notes ?? "",
                    supportingObservations: selectedCapability.supportingObservations,
                  }
                : undefined
            }
            onSubmit={dialogMode === "edit" ? handleUpdate : handleCreate}
            onCancel={closeDialog}
            isSubmitting={isSubmitting}
            submitLabel={dialogMode === "edit" ? "Save Changes" : "Add Capability"}
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
            <DialogTitle>Delete capability</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {deleteTarget
              ? `Delete "${deleteTarget.name}"? This action cannot be undone.`
              : "Delete this capability?"}
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
