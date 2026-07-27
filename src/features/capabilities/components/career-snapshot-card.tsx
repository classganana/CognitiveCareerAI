import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { CareerSnapshot } from "@/features/career-cases/types";
import { CareerStage } from "@/types/enums";
import { formatCareerStage, formatDate } from "@/utils/labels";

type CareerSnapshotCardProps = {
  snapshot: CareerSnapshot;
};

export function CareerSnapshotCard({ snapshot }: CareerSnapshotCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Career Snapshot</CardTitle>
        <CardDescription>
          Current assessment summary for this mentee
        </CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-sm text-muted-foreground">Career Stage</dt>
            <dd className="font-medium">
              {formatCareerStage(snapshot.careerStage as CareerStage)}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Current Role</dt>
            <dd className="font-medium">{snapshot.currentRole}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Target Role</dt>
            <dd className="font-medium">{snapshot.targetRole}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Total Capabilities</dt>
            <dd className="font-medium">{snapshot.totalCapabilities}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Average Confidence</dt>
            <dd className="font-medium">{snapshot.averageConfidence}%</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Last Assessment</dt>
            <dd className="font-medium">
              {snapshot.lastAssessmentDate
                ? formatDate(snapshot.lastAssessmentDate)
                : "Not assessed yet"}
            </dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Active Goals</dt>
            <dd className="font-medium">{snapshot.activeGoals}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Completed Goals</dt>
            <dd className="font-medium">{snapshot.completedGoals}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Overall Goal Progress</dt>
            <dd className="font-medium">{snapshot.overallGoalProgress}%</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Total Recommendations</dt>
            <dd className="font-medium">{snapshot.totalRecommendations}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Active Recommendations</dt>
            <dd className="font-medium">{snapshot.activeRecommendations}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Completed Recommendations</dt>
            <dd className="font-medium">{snapshot.completedRecommendations}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
