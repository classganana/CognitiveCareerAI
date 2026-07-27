"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
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
import { SearchableSelect } from "@/components/ui/searchable-select";
import { KnowledgeEditForm } from "@/features/knowledge/components/knowledge-edit-form";
import type { SerializedKnowledgeClaimDetail } from "@/features/knowledge/lib/serialize-knowledge";
import {
  addEvidenceToKnowledgeClaim,
  fetchAvailableObservationsForKnowledgeClaim,
  fetchKnowledgeClaimDetails,
  removeEvidenceFromKnowledgeClaim,
  updateKnowledgeClaim,
} from "@/features/knowledge/lib/knowledge-api";
import type { SerializedObservation } from "@/features/meetings/lib/serialize-meeting";
import {
  KnowledgeDomain,
  KnowledgeValidationStatus,
} from "@/types/domain/knowledge-domain";
import {
  formatKnowledgeDomain,
  formatKnowledgeValidationStatus,
} from "@/utils/knowledge-labels";
import { formatDate } from "@/utils/labels";
import {
  formatObservationCategory,
  formatObservationSeverity,
} from "@/utils/session-labels";

type KnowledgeDetailPageProps = {
  claim: SerializedKnowledgeClaimDetail;
};

export function KnowledgeDetailPage({ claim: initialClaim }: KnowledgeDetailPageProps) {
  const router = useRouter();
  const [claim, setClaim] = useState(initialClaim);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddEvidenceDialog, setShowAddEvidenceDialog] = useState(false);
  const [availableObservations, setAvailableObservations] = useState<
    SerializedObservation[]
  >([]);
  const [selectedObservationId, setSelectedObservationId] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddingEvidence, setIsAddingEvidence] = useState(false);
  const [removingEvidenceId, setRemovingEvidenceId] = useState<string | null>(null);

  useEffect(() => {
    setClaim(initialClaim);
  }, [initialClaim]);

  async function handleUpdate(values: {
    title: string;
    summary: string;
    domain: KnowledgeDomain;
    tags: string[];
    confidence: number;
    validationStatus: KnowledgeValidationStatus;
  }) {
    setIsSubmitting(true);

    try {
      await updateKnowledgeClaim(claim._id, values);
      const updated = await fetchKnowledgeClaimDetails(claim._id);
      setClaim(updated);
      toast.success("Knowledge claim updated");
      setShowEditDialog(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update knowledge claim",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function openAddEvidenceDialog() {
    try {
      const observations = await fetchAvailableObservationsForKnowledgeClaim(claim._id);
      setAvailableObservations(observations);
      setSelectedObservationId(undefined);
      setShowAddEvidenceDialog(true);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load observations",
      );
    }
  }

  async function handleAddEvidence() {
    if (!selectedObservationId) {
      toast.error("Select an observation to link");
      return;
    }

    setIsAddingEvidence(true);

    try {
      const updated = await addEvidenceToKnowledgeClaim(
        claim._id,
        selectedObservationId,
      );
      setClaim(updated);
      toast.success("Observation linked as evidence");
      setShowAddEvidenceDialog(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add evidence",
      );
    } finally {
      setIsAddingEvidence(false);
    }
  }

  async function handleRemoveEvidence(evidenceId: string) {
    setRemovingEvidenceId(evidenceId);

    try {
      const updated = await removeEvidenceFromKnowledgeClaim(claim._id, evidenceId);
      setClaim(updated);
      toast.success("Evidence removed");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to remove evidence",
      );
    } finally {
      setRemovingEvidenceId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/knowledge-repository">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="size-4" />
            Back to Repository
          </Button>
        </Link>
        {!claim.archived ? (
          <Button variant="outline" size="sm" onClick={() => setShowEditDialog(true)}>
            Edit Knowledge Claim
          </Button>
        ) : null}
      </div>

      <Card>
        <CardHeader className="gap-3">
          <CardTitle>{claim.title}</CardTitle>
          <CardDescription>Reusable mentor knowledge claim</CardDescription>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{formatKnowledgeDomain(claim.domain)}</Badge>
            <Badge variant="secondary">
              {formatKnowledgeValidationStatus(claim.validationStatus)}
            </Badge>
            <Badge variant="outline">{claim.confidence}% confidence</Badge>
            {claim.archived ? <Badge variant="destructive">Archived</Badge> : null}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-sm font-medium">Summary</h3>
            <p className="mt-1 text-sm whitespace-pre-wrap text-muted-foreground">
              {claim.statement}
            </p>
          </div>
          {claim.tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {claim.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          ) : null}
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">Created</dt>
              <dd className="font-medium">{formatDate(claim.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Supporting Observations</dt>
              <dd className="font-medium">{claim.evidence.length}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>Supporting Evidence</CardTitle>
            <CardDescription>
              Observations that support this knowledge claim
            </CardDescription>
          </div>
          {!claim.archived ? (
            <Button size="sm" onClick={openAddEvidenceDialog}>
              <Plus className="size-4" />
              Add Existing Observation
            </Button>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-4">
          {claim.evidence.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No supporting observations linked yet.
            </p>
          ) : (
            claim.evidence.map((item) => (
              <div key={item._id} className="rounded-lg border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    {item.observation ? (
                      <>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium">{item.observation.title}</p>
                          <Badge variant="outline">
                            {formatObservationCategory(item.observation.category)}
                          </Badge>
                          <Badge variant="secondary">
                            {formatObservationSeverity(item.observation.severity)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.observation.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Observed {formatDate(item.observation.createdAt)}
                        </p>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Observation no longer available
                      </p>
                    )}
                  </div>
                  {!claim.archived ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveEvidence(item._id)}
                      disabled={removingEvidenceId === item._id}
                      aria-label="Remove evidence"
                    >
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Knowledge Claim</DialogTitle>
          </DialogHeader>
          <KnowledgeEditForm
            defaultValues={{
              title: claim.title,
              summary: claim.statement,
              domain: claim.domain,
              tagsInput: claim.tags.join(", "),
              confidence: claim.confidence,
              validationStatus: claim.validationStatus,
            }}
            onSubmit={handleUpdate}
            onCancel={() => setShowEditDialog(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showAddEvidenceDialog} onOpenChange={setShowAddEvidenceDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Existing Observation</DialogTitle>
          </DialogHeader>
          {availableObservations.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No unpromoted observations are available to link.
            </p>
          ) : (
            <SearchableSelect
              options={availableObservations.map((observation) => ({
                value: observation._id,
                label: observation.title,
              }))}
              value={selectedObservationId}
              onChange={setSelectedObservationId}
              placeholder="Search observations..."
              emptyLabel="No observations found"
            />
          )}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAddEvidenceDialog(false)}
              disabled={isAddingEvidence}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddEvidence}
              disabled={isAddingEvidence || availableObservations.length === 0}
            >
              {isAddingEvidence ? "Linking..." : "Add Evidence"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
