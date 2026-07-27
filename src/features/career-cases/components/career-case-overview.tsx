import {
  Briefcase,
  Calendar,
  ClipboardList,
  Flag,
  Lightbulb,
  ListTodo,
  Target,
} from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CareerCaseWorkspaceCounts } from "@/features/career-cases/types";

type CareerCaseOverviewCardsProps = {
  counts: CareerCaseWorkspaceCounts;
};

const overviewMetrics = [
  {
    key: "meetingsCount" as const,
    label: "Meetings",
    icon: Calendar,
  },
  {
    key: "observationsCount" as const,
    label: "Observations",
    icon: ClipboardList,
  },
  {
    key: "capabilitiesCount" as const,
    label: "Capabilities",
    icon: Target,
  },
  {
    key: "goalsCount" as const,
    label: "Goals",
    icon: Flag,
  },
  {
    key: "tasksCount" as const,
    label: "Tasks",
    icon: ListTodo,
  },
  {
    key: "recommendationsCount" as const,
    label: "Recommendations",
    icon: Lightbulb,
  },
];

export function CareerCaseOverviewCards({ counts }: CareerCaseOverviewCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {overviewMetrics.map(({ key, label, icon: Icon }) => (
        <Card key={key}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between gap-3">
              <CardDescription>{label}</CardDescription>
              <Icon className="size-4 text-muted-foreground" />
            </div>
            <CardTitle className="text-3xl">{counts[key]}</CardTitle>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

export function CareerCaseProfileSummary({
  menteeName,
  careerStage,
  currentRole,
  targetRole,
  status,
  createdAt,
}: {
  menteeName: string;
  careerStage: string;
  currentRole: string;
  targetRole: string;
  status: string;
  createdAt: string;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-muted">
            <Briefcase className="size-5 text-muted-foreground" />
          </div>
          <div className="space-y-1">
            <CardTitle>{menteeName}</CardTitle>
            <CardDescription>Mentee Profile Summary</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardHeader className="pt-0">
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <dt className="text-sm text-muted-foreground">Career Stage</dt>
            <dd className="font-medium">{careerStage}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Current Role</dt>
            <dd className="font-medium">{currentRole}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Target Role</dt>
            <dd className="font-medium">{targetRole}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Status</dt>
            <dd className="font-medium">{status}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Created</dt>
            <dd className="font-medium">{createdAt}</dd>
          </div>
        </dl>
      </CardHeader>
    </Card>
  );
}
