import { PageShell } from "@/components/layout/page-shell";
import { DashboardActivityFeed } from "@/features/dashboard/components/dashboard-activity-feed";
import { DashboardMetricsGrid } from "@/features/dashboard/components/dashboard-metrics-grid";
import { DashboardQuickActions } from "@/features/dashboard/components/dashboard-quick-actions";
import { getDashboardData } from "@/services/dashboard.service";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <PageShell
      title="Dashboard"
      description="Overview of your mentoring practice and recent activity."
    >
      <div className="space-y-6">
        <DashboardQuickActions
          defaultSessionCareerCaseId={data.defaultSessionCareerCaseId}
        />
        <DashboardMetricsGrid metrics={data.metrics} />
        <DashboardActivityFeed activity={data.recentActivity} />
      </div>
    </PageShell>
  );
}
