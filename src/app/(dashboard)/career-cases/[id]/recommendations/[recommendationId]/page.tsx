import { notFound } from "next/navigation";

import { PageShell } from "@/components/layout/page-shell";
import { RecommendationDetailPage } from "@/features/recommendations/components/recommendation-detail-page";
import { getRecommendationDetails } from "@/services/recommendation.service";
import { getCareerCaseWorkspace } from "@/services/career-case.service";

export const dynamic = "force-dynamic";

type RecommendationDetailRouteProps = {
  params: Promise<{ id: string; recommendationId: string }>;
};

export default async function RecommendationDetailRoute({
  params,
}: RecommendationDetailRouteProps) {
  const { id, recommendationId } = await params;

  const [workspace, recommendation] = await Promise.all([
    getCareerCaseWorkspace(id),
    getRecommendationDetails(id, recommendationId),
  ]);

  if (!workspace || !recommendation) {
    notFound();
  }

  return (
    <PageShell
      title={recommendation.title}
      description={`Coaching recommendation for ${workspace.mentee.fullName}`}
    >
      <RecommendationDetailPage careerCaseId={id} recommendation={recommendation} />
    </PageShell>
  );
}
