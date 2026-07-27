"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { EmptyPage } from "@/components/layout/empty-page";
import { TableSkeleton } from "@/components/layout/table-skeleton";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { SerializedMeetingWithObservationCount } from "@/features/meetings/lib/serialize-meeting";
import { deleteMeeting, fetchMeetings } from "@/features/meetings/lib/meeting-api";
import { formatDate } from "@/utils/labels";
import { formatSessionType } from "@/utils/session-labels";

type MeetingsTabProps = {
  careerCaseId: string;
};

export function MeetingsTab({ careerCaseId }: MeetingsTabProps) {
  const router = useRouter();
  const [meetings, setMeetings] = useState<SerializedMeetingWithObservationCount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] =
    useState<SerializedMeetingWithObservationCount | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadMeetings = useCallback(async () => {
    try {
      const data = await fetchMeetings(careerCaseId);
      setMeetings(data);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load sessions",
      );
    } finally {
      setIsLoading(false);
    }
  }, [careerCaseId]);

  useEffect(() => {
    loadMeetings();
  }, [loadMeetings]);

  async function handleDelete() {
    if (!deleteTarget) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteMeeting(careerCaseId, deleteTarget._id);
      setMeetings((current) =>
        current.filter((meeting) => meeting._id !== deleteTarget._id),
      );
      toast.success("Session deleted successfully");
      setDeleteTarget(null);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete session",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Link href={`/career-cases/${careerCaseId}/meetings/new`}>
          <Button>
            <Plus className="size-4" />
            Create Session
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border">
        {isLoading ? (
          <TableSkeleton rows={4} columns={6} />
        ) : meetings.length === 0 ? (
          <EmptyPage
            title="No mentoring sessions recorded yet"
            description="Create your first session to begin capturing observations and mentoring notes."
            action={{
              label: "Create Session",
              href: `/career-cases/${careerCaseId}/meetings/new`,
            }}
          />
        ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Session Date</TableHead>
              <TableHead>Session Type</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Overall Summary</TableHead>
              <TableHead>Observations</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {meetings.map((meeting) => (
                <TableRow key={meeting._id}>
                  <TableCell>{formatDate(meeting.sessionDate)}</TableCell>
                  <TableCell>{formatSessionType(meeting.sessionType)}</TableCell>
                  <TableCell>{meeting.durationMinutes} min</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {meeting.summary || "—"}
                  </TableCell>
                  <TableCell>{meeting.observationsCount}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Link
                        href={`/career-cases/${careerCaseId}/meetings/${meeting._id}`}
                      >
                        <Button variant="ghost" size="icon" aria-label="View session">
                          <Eye className="size-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteTarget(meeting)}
                        aria-label="Delete session"
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
            ))}
          </TableBody>
        </Table>
        )}
      </div>

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
            <DialogTitle>Delete session</DialogTitle>
            <DialogDescription>
              {deleteTarget
                ? `Delete this ${formatSessionType(deleteTarget.sessionType).toLowerCase()} session and all of its observations?`
                : "Delete this session?"}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete Session"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
