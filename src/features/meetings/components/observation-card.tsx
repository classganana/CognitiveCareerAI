"use client";

import Link from "next/link";
import { BookOpen, Pencil, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SerializedObservation } from "@/features/meetings/lib/serialize-meeting";
import { formatDate } from "@/utils/labels";
import {
  formatObservationCategory,
  formatObservationSeverity,
} from "@/utils/session-labels";
import { ObservationSeverity } from "@/types/enums";

type ObservationCardProps = {
  observation: SerializedObservation;
  knowledgeClaimId?: string;
  onEdit: (observation: SerializedObservation) => void;
  onDelete: (observation: SerializedObservation) => void;
  onPromote: (observation: SerializedObservation) => void;
};

function severityVariant(severity: ObservationSeverity) {
  switch (severity) {
    case ObservationSeverity.HIGH:
      return "destructive" as const;
    case ObservationSeverity.MEDIUM:
      return "secondary" as const;
    case ObservationSeverity.LOW:
      return "outline" as const;
    default:
      return "secondary" as const;
  }
}

export function ObservationCard({
  observation,
  knowledgeClaimId,
  onEdit,
  onDelete,
  onPromote,
}: ObservationCardProps) {
  return (
    <Card>
      <CardHeader className="gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <CardTitle className="text-base">{observation.title}</CardTitle>
            <CardDescription>{formatDate(observation.createdAt)}</CardDescription>
          </div>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(observation)}
              aria-label={`Edit ${observation.title}`}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(observation)}
              aria-label={`Delete ${observation.title}`}
            >
              <Trash2 className="size-4 text-destructive" />
            </Button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">
            {formatObservationCategory(observation.category)}
          </Badge>
          <Badge variant={severityVariant(observation.severity)}>
            {formatObservationSeverity(observation.severity)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm whitespace-pre-wrap text-muted-foreground">
          {observation.description}
        </p>
        {knowledgeClaimId ? (
          <Link href={`/knowledge/${knowledgeClaimId}`}>
            <Button variant="outline" size="sm">
              <BookOpen className="size-4" />
              View Knowledge Claim
            </Button>
          </Link>
        ) : (
          <Button variant="outline" size="sm" onClick={() => onPromote(observation)}>
            <BookOpen className="size-4" />
            Promote to Knowledge
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
