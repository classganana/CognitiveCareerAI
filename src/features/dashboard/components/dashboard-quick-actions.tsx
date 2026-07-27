import Link from "next/link";
import { Plus, BookOpen, CalendarPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type DashboardQuickActionsProps = {
  defaultSessionCareerCaseId: string | null;
};

export function DashboardQuickActions({
  defaultSessionCareerCaseId,
}: DashboardQuickActionsProps) {
  const sessionHref = defaultSessionCareerCaseId
    ? `/career-cases/${defaultSessionCareerCaseId}/meetings/new`
    : "/mentees/new";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Jump into the core mentoring workflow</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-3">
        <Link href="/mentees/new">
          <Button>
            <Plus className="size-4" />
            Add Mentee
          </Button>
        </Link>
        <Link href={sessionHref}>
          <Button variant="outline">
            <CalendarPlus className="size-4" />
            Start Mentoring Session
          </Button>
        </Link>
        <Link href="/knowledge-repository">
          <Button variant="outline">
            <BookOpen className="size-4" />
            Open Knowledge Repository
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
