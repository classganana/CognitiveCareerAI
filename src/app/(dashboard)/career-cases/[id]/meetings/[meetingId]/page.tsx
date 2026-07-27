import { notFound } from "next/navigation";

import { PageShell } from "@/components/layout/page-shell";
import { SessionDetailsPage } from "@/features/meetings/components/session-details-page";
import { getCareerCaseWorkspace } from "@/services/career-case.service";
import { getMeetingDetails } from "@/services/meeting.service";
import { formatSessionType } from "@/utils/session-labels";

export const dynamic = "force-dynamic";

type MeetingDetailsRouteProps = {
  params: Promise<{ id: string; meetingId: string }>;
};

export default async function MeetingDetailsRoute({
  params,
}: MeetingDetailsRouteProps) {
  const { id, meetingId } = await params;

  const [workspace, details] = await Promise.all([
    getCareerCaseWorkspace(id),
    getMeetingDetails(meetingId, id),
  ]);

  if (!workspace || !details) {
    notFound();
  }

  return (
    <PageShell
      title={formatSessionType(details.meeting.sessionType)}
      description={`Session details for ${workspace.mentee.fullName}`}
    >
      <SessionDetailsPage
        careerCaseId={id}
        meeting={details.meeting}
        observations={details.observations}
      />
    </PageShell>
  );
}
