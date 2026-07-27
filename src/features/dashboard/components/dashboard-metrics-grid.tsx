import {
  BookOpen,
  Briefcase,
  ClipboardList,
  Lightbulb,
  Target,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DashboardMetrics } from "@/services/dashboard.service";

type DashboardMetricsGridProps = {
  metrics: DashboardMetrics;
};

const metricItems = [
  { key: "totalMentees", label: "Total Mentees", icon: Users },
  { key: "activeCareerCases", label: "Active Career Cases", icon: Briefcase },
  { key: "meetingsConducted", label: "Meetings Conducted", icon: ClipboardList },
  { key: "observationsLogged", label: "Observations Logged", icon: ClipboardList },
  { key: "capabilitiesAssessed", label: "Capabilities Assessed", icon: Target },
  { key: "activeGoals", label: "Active Goals", icon: Target },
  { key: "activeRecommendations", label: "Active Recommendations", icon: Lightbulb },
  { key: "knowledgeClaims", label: "Knowledge Claims", icon: BookOpen },
  {
    key: "validatedKnowledgeClaims",
    label: "Validated Knowledge Claims",
    icon: BookOpen,
  },
] as const;

export function DashboardMetricsGrid({ metrics }: DashboardMetricsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {metricItems.map((item) => {
        const Icon = item.icon;
        const value = metrics[item.key];

        return (
          <Card key={item.key}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.label}
              </CardTitle>
              <Icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold tracking-tight">{value}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
