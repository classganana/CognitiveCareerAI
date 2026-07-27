import { notFound } from "next/navigation";

import { PageShell } from "@/components/layout/page-shell";
import { KnowledgeDetailPage } from "@/features/knowledge/components/knowledge-detail-page";
import { getKnowledgeClaimDetails } from "@/services/knowledge.service";

export const dynamic = "force-dynamic";

type KnowledgeDetailRouteProps = {
  params: Promise<{ knowledgeId: string }>;
};

export default async function KnowledgeDetailRoute({
  params,
}: KnowledgeDetailRouteProps) {
  const { knowledgeId } = await params;
  const claim = await getKnowledgeClaimDetails(knowledgeId);

  if (!claim) {
    notFound();
  }

  return (
    <PageShell
      title={claim.title}
      description="Knowledge claim details and supporting evidence"
    >
      <KnowledgeDetailPage claim={claim} />
    </PageShell>
  );
}
