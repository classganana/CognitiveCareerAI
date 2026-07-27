"use client";

import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SerializedCapabilityDetail } from "@/features/capabilities/lib/serialize-capability";
import {
  formatCapabilityCategory,
  formatCapabilityLevel,
} from "@/utils/capability-labels";
import { formatDate } from "@/utils/labels";
import {
  formatObservationCategory,
  formatObservationSeverity,
} from "@/utils/session-labels";

type CapabilityDetailPageProps = {
  careerCaseId: string;
  capability: SerializedCapabilityDetail;
};

export function CapabilityDetailPage({
  careerCaseId,
  capability,
}: CapabilityDetailPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href={`/career-cases/${careerCaseId}?tab=capabilities`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="size-4" />
            Back to Capabilities
          </Button>
        </Link>
        <Link href={`/career-cases/${careerCaseId}?tab=capabilities`}>
          <Button variant="outline" size="sm">
            <Pencil className="size-4" />
            Edit from List
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="gap-3">
          <CardTitle>{capability.name}</CardTitle>
          <CardDescription>Capability assessment details</CardDescription>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">
              {formatCapabilityCategory(capability.category)}
            </Badge>
            <Badge variant="outline">{formatCapabilityLevel(capability.level)}</Badge>
            <Badge variant="secondary">{capability.confidence}% confidence</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {capability.notes ? (
            <div>
              <h3 className="text-sm font-medium">Notes</h3>
              <p className="mt-1 text-sm whitespace-pre-wrap text-muted-foreground">
                {capability.notes}
              </p>
            </div>
          ) : null}
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">Last Reviewed</dt>
              <dd className="font-medium">
                {capability.lastReviewedAt
                  ? formatDate(capability.lastReviewedAt)
                  : "Not reviewed"}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Supporting Observations</dt>
              <dd className="font-medium">{capability.supportingObservations.length}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Linked Observations</CardTitle>
          <CardDescription>
            Observations supporting this capability assessment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {capability.linkedObservations.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No observations linked to this capability yet.
            </p>
          ) : (
            capability.linkedObservations.map((observation) => (
              <div key={observation._id} className="rounded-lg border p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium">{observation.title}</p>
                  <Badge variant="outline">
                    {formatObservationCategory(observation.category)}
                  </Badge>
                  <Badge variant="secondary">
                    {formatObservationSeverity(observation.severity)}
                  </Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {observation.description}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Review Timeline</CardTitle>
          <CardDescription>Assessment history for this capability</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border p-4">
            <p className="font-medium">Current Assessment</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {capability.lastReviewedAt
                ? formatDate(capability.lastReviewedAt)
                : "Not reviewed yet"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
