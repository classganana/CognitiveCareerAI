"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Eye, Briefcase, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { EmptyPage } from "@/components/layout/empty-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { MenteeListItem } from "@/services/career-case.service";
import { deleteMentee } from "@/features/mentees/lib/mentee-api";
import { MenteeDeleteDialog } from "@/features/mentees/components/mentee-delete-dialog";
import {
  formatCareerStage,
  formatDate,
  formatMenteeStatus,
} from "@/utils/labels";
import { MenteeStatus } from "@/types/domain/mentee";

type MenteeListProps = {
  initialMentees: MenteeListItem[];
};

function statusVariant(status: MenteeStatus) {
  switch (status) {
    case MenteeStatus.ACTIVE:
      return "default" as const;
    case MenteeStatus.ON_HOLD:
      return "secondary" as const;
    case MenteeStatus.INACTIVE:
      return "outline" as const;
    default:
      return "secondary" as const;
  }
}

export function MenteeList({ initialMentees }: MenteeListProps) {
  const [mentees, setMentees] = useState(initialMentees);
  const [nameQuery, setNameQuery] = useState("");
  const [emailQuery, setEmailQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<MenteeListItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredMentees = useMemo(() => {
    const normalizedName = nameQuery.trim().toLowerCase();
    const normalizedEmail = emailQuery.trim().toLowerCase();

    return mentees.filter((mentee) => {
      const matchesName =
        !normalizedName ||
        mentee.fullName.toLowerCase().includes(normalizedName);
      const matchesEmail =
        !normalizedEmail ||
        mentee.email.toLowerCase().includes(normalizedEmail);

      return matchesName && matchesEmail;
    });
  }, [emailQuery, mentees, nameQuery]);

  async function handleDelete() {
    if (!deleteTarget) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteMentee(deleteTarget._id);
      setMentees((current) =>
        current.filter((mentee) => mentee._id !== deleteTarget._id),
      );
      toast.success("Mentee deleted successfully");
      setDeleteTarget(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete mentee",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="grid flex-1 gap-3 sm:max-w-2xl sm:grid-cols-2">
          <div className="relative">
            <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name"
              value={nameQuery}
              onChange={(event) => setNameQuery(event.target.value)}
              className="pl-8"
            />
          </div>
          <div className="relative">
            <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by email"
              value={emailQuery}
              onChange={(event) => setEmailQuery(event.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <Link href="/mentees/new">
          <Button>
            <Plus className="size-4" />
            Add Mentee
          </Button>
        </Link>
      </div>

      <div className="rounded-xl border">
        {filteredMentees.length === 0 && mentees.length === 0 ? (
          <EmptyPage
            title="No mentees yet"
            description="Add your first mentee to start building career cases and mentoring sessions."
            action={{ label: "Add Mentee", href: "/mentees/new" }}
          />
        ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Career Stage</TableHead>
              <TableHead>Current Role</TableHead>
              <TableHead>Target Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMentees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  No mentees match your search.
                </TableCell>
              </TableRow>
            ) : (
              filteredMentees.map((mentee) => (
                <TableRow key={mentee._id}>
                  <TableCell className="font-medium">{mentee.fullName}</TableCell>
                  <TableCell>{mentee.email}</TableCell>
                  <TableCell>{formatCareerStage(mentee.careerStage)}</TableCell>
                  <TableCell>{mentee.currentRole}</TableCell>
                  <TableCell>{mentee.targetRole}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(mentee.status)}>
                      {formatMenteeStatus(mentee.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(mentee.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      {mentee.careerCaseId ? (
                        <Link href={`/career-cases/${mentee.careerCaseId}`}>
                          <Button variant="outline" size="sm">
                            <Briefcase className="size-4" />
                            Open Career Case
                          </Button>
                        </Link>
                      ) : null}
                      <Link href={`/mentees/${mentee._id}`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`View ${mentee.fullName}`}
                        >
                          <Eye className="size-4" />
                        </Button>
                      </Link>
                      <Link href={`/mentees/${mentee._id}/edit`}>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label={`Edit ${mentee.fullName}`}
                        >
                          <Pencil className="size-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteTarget(mentee)}
                        aria-label={`Delete ${mentee.fullName}`}
                      >
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        )}
      </div>

      <MenteeDeleteDialog
        mentee={deleteTarget}
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
}
