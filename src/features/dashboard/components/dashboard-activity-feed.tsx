import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DashboardActivityItem } from "@/services/dashboard.service";
import { getActivityIcon, getActivityIconClassName } from "@/utils/activity-icons";
import { formatDate } from "@/utils/labels";

type DashboardActivityFeedProps = {
  activity: DashboardActivityItem[];
};

export function DashboardActivityFeed({ activity }: DashboardActivityFeedProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest mentoring activity across all career cases
        </CardDescription>
      </CardHeader>
      <CardContent>
        {activity.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No activity yet. Add a mentee and start your first mentoring session.
          </p>
        ) : (
          <ol className="space-y-4">
            {activity.map((item) => {
              const Icon = getActivityIcon(item.type);

              return (
                <li
                  key={item.id}
                  className="flex items-start gap-3 rounded-lg border p-4"
                >
                  <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border bg-muted/40">
                    <Icon className={`size-4 ${getActivityIconClassName(item.type)}`} />
                  </span>
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <p className="font-medium">{item.title}</p>
                      <time
                        className="text-xs text-muted-foreground"
                        dateTime={item.occurredAt}
                      >
                        {formatDate(item.occurredAt)}
                      </time>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.actor}</p>
                    {item.description ? (
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}
