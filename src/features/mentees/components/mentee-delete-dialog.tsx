"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { SerializedMentee } from "@/features/mentees/lib/serialize-mentee";

type MenteeDeleteDialogProps = {
  mentee: SerializedMentee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
};

export function MenteeDeleteDialog({
  mentee,
  open,
  onOpenChange,
  onConfirm,
  isDeleting,
}: MenteeDeleteDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete mentee</DialogTitle>
          <DialogDescription>
            {mentee
              ? `Are you sure you want to delete ${mentee.fullName}? This will permanently remove their career case, meetings, observations, capabilities, goals, tasks, and recommendations.`
              : "Are you sure you want to delete this mentee?"}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : "Delete Mentee"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
