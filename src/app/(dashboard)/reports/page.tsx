import { PageShell } from "@/components/layout/page-shell";
import { EmptyPage } from "@/components/layout/empty-page";

export default function ReportsPage() {
  return (
    <PageShell
      title="Reports"
      description="Insights and summaries across your mentoring practice."
    >
      <EmptyPage
        title="Reports are planned for a future release"
        description="The MVP focuses on the core mentoring workflow. Advanced reporting will arrive in a later version."
        action={{ label: "Back to Dashboard", href: "/" }}
      />
    </PageShell>
  );
}
