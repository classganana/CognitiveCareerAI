"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Archive, Eye, Pencil } from "lucide-react";
import { toast } from "sonner";

import { CardGridSkeleton } from "@/components/layout/card-grid-skeleton";
import { EmptyPage } from "@/components/layout/empty-page";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
import { KnowledgeEditForm } from "@/features/knowledge/components/knowledge-edit-form";
import type { SerializedKnowledgeClaimSummary } from "@/features/knowledge/lib/serialize-knowledge";
import {
  archiveKnowledgeClaim,
  fetchKnowledgeClaims,
  updateKnowledgeClaim,
} from "@/features/knowledge/lib/knowledge-api";
import {
  KNOWLEDGE_DOMAINS,
  KNOWLEDGE_VALIDATION_STATUSES,
  KnowledgeDomain,
  KnowledgeValidationStatus,
} from "@/types/domain/knowledge-domain";
import {
  formatKnowledgeDomain,
  formatKnowledgeValidationStatus,
} from "@/utils/knowledge-labels";
import { formatDate } from "@/utils/labels";

export function KnowledgeRepositoryView() {
  const router = useRouter();
  const [claims, setClaims] = useState<SerializedKnowledgeClaimSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [domainFilter, setDomainFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showArchived, setShowArchived] = useState(false);
  const [editTarget, setEditTarget] = useState<SerializedKnowledgeClaimSummary | null>(
    null,
  );
  const [archiveTarget, setArchiveTarget] =
    useState<SerializedKnowledgeClaimSummary | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);

  const loadClaims = useCallback(async () => {
    try {
      const data = await fetchKnowledgeClaims();
      setClaims(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load knowledge claims",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadClaims();
  }, [loadClaims]);

  const filteredClaims = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return claims.filter((claim) => {
      if (!showArchived && claim.archived) {
        return false;
      }

      if (domainFilter !== "all" && claim.domain !== domainFilter) {
        return false;
      }

      if (statusFilter !== "all" && claim.validationStatus !== statusFilter) {
        return false;
      }

      if (normalizedQuery && !claim.title.toLowerCase().includes(normalizedQuery)) {
        return false;
      }

      return true;
    });
  }, [claims, domainFilter, searchQuery, showArchived, statusFilter]);

  async function handleUpdate(values: {
    title: string;
    summary: string;
    domain: KnowledgeDomain;
    tags: string[];
    confidence: number;
    validationStatus: KnowledgeValidationStatus;
  }) {
    if (!editTarget) {
      return;
    }

    setIsSubmitting(true);

    try {
      await updateKnowledgeClaim(editTarget._id, values);
      toast.success("Knowledge claim updated");
      setEditTarget(null);
      await loadClaims();
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update knowledge claim",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleArchive() {
    if (!archiveTarget) {
      return;
    }

    setIsArchiving(true);

    try {
      await archiveKnowledgeClaim(archiveTarget._id);
      toast.success("Knowledge claim archived");
      setArchiveTarget(null);
      await loadClaims();
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to archive knowledge claim",
      );
    } finally {
      setIsArchiving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Input
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
        />
        <Select
          value={domainFilter}
          onValueChange={(value) => setDomainFilter(value ?? "all")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by domain" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All domains</SelectItem>
            {KNOWLEDGE_DOMAINS.map((domain) => (
              <SelectItem key={domain} value={domain}>
                {formatKnowledgeDomain(domain)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value ?? "all")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {KNOWLEDGE_VALIDATION_STATUSES.map((status) => (
              <SelectItem key={status} value={status}>
                {formatKnowledgeValidationStatus(status)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={showArchived}
          onChange={(event) => setShowArchived(event.target.checked)}
        />
        Show archived claims
      </label>

      {isLoading ? (
        <CardGridSkeleton count={2} />
      ) : filteredClaims.length === 0 ? (
        <EmptyPage
          title="No knowledge claims yet"
          description="Promote your first observation into reusable knowledge from a mentoring session."
          action={{
            label: "View Mentees",
            href: "/mentees",
          }}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredClaims.map((claim) => (
            <Card key={claim._id} className={claim.archived ? "opacity-70" : undefined}>
              <CardHeader className="gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="text-base">{claim.title}</CardTitle>
                    <CardDescription>
                      Created {formatDate(claim.createdAt)}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Link href={`/knowledge/${claim._id}`}>
                      <Button variant="ghost" size="icon" aria-label="View knowledge claim">
                        <Eye className="size-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditTarget(claim)}
                      aria-label="Edit knowledge claim"
                      disabled={claim.archived}
                    >
                      <Pencil className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setArchiveTarget(claim)}
                      aria-label="Archive knowledge claim"
                      disabled={claim.archived}
                    >
                      <Archive className="size-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{formatKnowledgeDomain(claim.domain)}</Badge>
                  <Badge variant="secondary">
                    {formatKnowledgeValidationStatus(claim.validationStatus)}
                  </Badge>
                  <Badge variant="outline">{claim.confidence}% confidence</Badge>
                  {claim.archived ? <Badge variant="destructive">Archived</Badge> : null}
                </div>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Supporting observations: {claim.supportingObservationsCount}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog
        open={!!editTarget}
        onOpenChange={(open) => {
          if (!open) {
            setEditTarget(null);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Knowledge Claim</DialogTitle>
          </DialogHeader>
          {editTarget ? (
            <KnowledgeEditForm
              key={editTarget._id}
              defaultValues={{
                title: editTarget.title,
                summary: editTarget.statement,
                domain: editTarget.domain,
                tagsInput: editTarget.tags.join(", "),
                confidence: editTarget.confidence,
                validationStatus: editTarget.validationStatus,
              }}
              onSubmit={handleUpdate}
              onCancel={() => setEditTarget(null)}
              isSubmitting={isSubmitting}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!archiveTarget}
        onOpenChange={(open) => {
          if (!open) {
            setArchiveTarget(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Archive knowledge claim</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            {archiveTarget
              ? `Archive "${archiveTarget.title}"? It will be hidden from the default repository view.`
              : "Archive this knowledge claim?"}
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setArchiveTarget(null)}
              disabled={isArchiving}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleArchive} disabled={isArchiving}>
              {isArchiving ? "Archiving..." : "Archive"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
