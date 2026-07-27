import { PageShell } from "@/components/layout/page-shell";
import { KnowledgeRepositoryView } from "@/features/knowledge/components/knowledge-repository-view";

export default function KnowledgeRepositoryPage() {
  return (
    <PageShell
      title="Knowledge Repository"
      description="Reusable mentor insights promoted from mentoring observations."
    >
      <KnowledgeRepositoryView />
    </PageShell>
  );
}
