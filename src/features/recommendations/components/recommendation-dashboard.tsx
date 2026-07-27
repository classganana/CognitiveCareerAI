import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { RecommendationDashboardStats } from "@/features/recommendations/lib/serialize-recommendation";

type RecommendationDashboardProps = {
  stats: RecommendationDashboardStats;
};

export function RecommendationDashboard({ stats }: RecommendationDashboardProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Active Recommendations</CardDescription>
          <CardTitle className="text-2xl">{stats.activeRecommendations}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Completed Recommendations</CardDescription>
          <CardTitle className="text-2xl">{stats.completedRecommendations}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Completion Rate</CardDescription>
          <CardTitle className="text-2xl">{stats.completionRate}%</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
