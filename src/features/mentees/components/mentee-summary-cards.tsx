import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { MenteeDetailResponse } from "@/features/mentees/lib/mentee-api";
import {
  formatCareerStage,
  formatDate,
  formatMenteeStatus,
} from "@/utils/labels";
import { CareerCaseStatus } from "@/types/domain/career-case";

type MenteeSummaryCardsProps = {
  data: MenteeDetailResponse;
};

function formatCaseStatus(status: CareerCaseStatus) {
  switch (status) {
    case CareerCaseStatus.ACTIVE:
      return "Active";
    case CareerCaseStatus.PAUSED:
      return "Paused";
    case CareerCaseStatus.CLOSED:
      return "Closed";
    default:
      return status;
  }
}

export function MenteeSummaryCards({ data }: MenteeSummaryCardsProps) {
  const { mentee, careerCase, summary } = data;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Mentee profile and contact details</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">Full Name</dt>
              <dd className="font-medium">{mentee.fullName}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Status</dt>
              <dd className="font-medium">{formatMenteeStatus(mentee.status)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Email</dt>
              <dd className="font-medium">{mentee.email}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Phone</dt>
              <dd className="font-medium">{mentee.phone}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Current Role</dt>
              <dd className="font-medium">{mentee.currentRole}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Target Role</dt>
              <dd className="font-medium">{mentee.targetRole}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Career Stage</dt>
              <dd className="font-medium">{formatCareerStage(mentee.careerStage)}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Years of Experience</dt>
              <dd className="font-medium">{mentee.yearsOfExperience}</dd>
            </div>
            {mentee.notes ? (
              <div className="sm:col-span-2">
                <dt className="text-sm text-muted-foreground">Notes</dt>
                <dd className="mt-1 whitespace-pre-wrap text-sm">{mentee.notes}</dd>
              </div>
            ) : null}
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Career Case Summary</CardTitle>
          <CardDescription>
            Workspace automatically created for this mentee
          </CardDescription>
        </CardHeader>
        <CardContent>
          {careerCase ? (
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-muted-foreground">Title</dt>
                <dd className="font-medium">{careerCase.title}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Status</dt>
                <dd className="font-medium">{formatCaseStatus(careerCase.status)}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Stage</dt>
                <dd className="font-medium">{formatCareerStage(careerCase.stage)}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Created</dt>
                <dd className="font-medium">{formatDate(careerCase.createdAt)}</dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">
              No career case found for this mentee.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Capabilities</CardDescription>
            <CardTitle className="text-3xl">{summary.capabilitiesCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Goals</CardDescription>
            <CardTitle className="text-3xl">{summary.goalsCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Meetings</CardDescription>
            <CardTitle className="text-3xl">{summary.meetingsCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Recommendations</CardDescription>
            <CardTitle className="text-3xl">{summary.recommendationsCount}</CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
