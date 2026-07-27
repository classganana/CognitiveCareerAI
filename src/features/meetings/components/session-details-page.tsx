"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SessionObservations } from "@/features/meetings/components/session-observations";
import type {
  SerializedMeeting,
  SerializedObservation,
} from "@/features/meetings/lib/serialize-meeting";
import { deleteMeeting } from "@/features/meetings/lib/meeting-api";
import { formatDate } from "@/utils/labels";
import { formatSessionType } from "@/utils/session-labels";

type SessionDetailsPageProps = {
  careerCaseId: string;
  meeting: SerializedMeeting;
  observations: SerializedObservation[];
};

export function SessionDetailsPage({
  careerCaseId,
  meeting,
  observations,
}: SessionDetailsPageProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDeleteSession() {
    setIsDeleting(true);

    try {
      await deleteMeeting(careerCaseId, meeting._id);
      toast.success("Session deleted successfully");
      router.push(`/career-cases/${careerCaseId}?tab=meetings`);
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
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href={`/career-cases/${careerCaseId}?tab=meetings`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="size-4" />
            Back to Sessions
          </Button>
        </Link>
        <Button variant="destructive" size="sm" onClick={() => setShowDeleteDialog(true)}>
          <Trash2 className="size-4" />
          Delete Session
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Session Information</CardTitle>
          <CardDescription>Mentoring session details</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-sm text-muted-foreground">Session Date</dt>
              <dd className="font-medium">{formatDate(meeting.sessionDate)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Session Type</dt>
              <dd className="font-medium">{formatSessionType(meeting.sessionType)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Duration</dt>
              <dd className="font-medium">{meeting.durationMinutes} minutes</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Observations</dt>
              <dd className="font-medium">{observations.length}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm whitespace-pre-wrap text-muted-foreground">
            {meeting.summary || "No summary provided for this session."}
          </p>
        </CardContent>
      </Card>

      <SessionObservations meetingId={meeting._id} initialObservations={observations} />

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete session</DialogTitle>
            <DialogDescription>
              Delete this mentoring session and all observations recorded during it?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSession} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Delete Session"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
