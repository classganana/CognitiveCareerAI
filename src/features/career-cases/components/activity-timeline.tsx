import { CircleDot } from "lucide-react";

import type { ActivityEvent } from "@/features/career-cases/types";
import { formatDate } from "@/utils/labels";

type ActivityTimelineProps = {
  events: ActivityEvent[];
};

export function ActivityTimeline({ events }: ActivityTimelineProps) {
  if (events.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No recent activity yet.</p>
    );
  }

  return (
    <ol className="space-y-4">
      {events.map((event) => (
        <li key={event.id} className="flex items-start gap-3">
          <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full border bg-background">
            <CircleDot className="size-4 text-muted-foreground" />
          </span>
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <p className="font-medium">{event.title}</p>
              <time
                className="text-xs text-muted-foreground"
                dateTime={event.occurredAt}
              >
                {formatDate(event.occurredAt)}
              </time>
            </div>
            {event.description ? (
              <p className="text-sm text-muted-foreground">{event.description}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
