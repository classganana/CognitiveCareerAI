"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { SerializedRecommendationDetail } from "@/features/recommendations/lib/serialize-recommendation";
import {
  formatRecommendationPriority,
  formatRecommendationStatus,
} from "@/utils/recommendation-labels";
import { formatDate } from "@/utils/labels";

type RecommendationDetailPageProps = {
  careerCaseId: string;
  recommendation: SerializedRecommendationDetail;
};

export function RecommendationDetailPage({
  careerCaseId,
  recommendation,
}: RecommendationDetailPageProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href={`/career-cases/${careerCaseId}?tab=recommendations`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="size-4" />
            Back to Recommendations
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="gap-3">
          <CardTitle>{recommendation.title}</CardTitle>
          <CardDescription>Mentor coaching recommendation</CardDescription>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">
              {formatRecommendationPriority(recommendation.priority)}
            </Badge>
            <Badge variant="secondary">
              {formatRecommendationStatus(recommendation.status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">Created</dt>
              <dd className="font-medium">{formatDate(recommendation.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Last Updated</dt>
              <dd className="font-medium">{formatDate(recommendation.updatedAt)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mentor Notes</CardTitle>
          <CardDescription>
            Coaching guidance explaining why this matters
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm whitespace-pre-wrap text-muted-foreground">
            {recommendation.description}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Linked Context</CardTitle>
          <CardDescription>
            Related capability and goal for this recommendation
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium">Related Capability</h3>
            {recommendation.relatedCapability ? (
              <Link
                href={`/career-cases/${careerCaseId}/capabilities/${recommendation.relatedCapability._id}`}
                className="mt-2 block text-sm text-primary hover:underline"
              >
                {recommendation.relatedCapability.name}
              </Link>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">None linked</p>
            )}
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="text-sm font-medium">Related Goal</h3>
            {recommendation.relatedGoal ? (
              <Link
                href={`/career-cases/${careerCaseId}/goals/${recommendation.relatedGoal._id}`}
                className="mt-2 block text-sm text-primary hover:underline"
              >
                {recommendation.relatedGoal.title}
              </Link>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">None linked</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
