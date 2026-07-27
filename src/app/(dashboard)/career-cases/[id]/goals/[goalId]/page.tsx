import { notFound } from "next/navigation";

import { PageShell } from "@/components/layout/page-shell";
import { GoalDetailPage } from "@/features/goals/components/goal-detail-page";
import { getGoalDetails } from "@/services/goal.service";
import { getCareerCaseWorkspace } from "@/services/career-case.service";

export const dynamic = "force-dynamic";

type GoalDetailRouteProps = {
  params: Promise<{ id: string; goalId: string }>;
};

export default async function GoalDetailRoute({ params }: GoalDetailRouteProps) {
  const { id, goalId } = await params;

  const [workspace, goal] = await Promise.all([
    getCareerCaseWorkspace(id),
    getGoalDetails(id, goalId),
  ]);

  if (!workspace || !goal) {
    notFound();
  }

  return (
    <PageShell
      title={goal.title}
      description={`Development goal for ${workspace.mentee.fullName}`}
    >
      <GoalDetailPage careerCaseId={id} goal={goal} />
    </PageShell>
  );
}
