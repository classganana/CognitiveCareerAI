import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { CreateMeetingPage } from "@/features/meetings/components/create-meeting-page";
import { getCareerCaseWorkspace } from "@/services/career-case.service";

export const dynamic = "force-dynamic";

type NewMeetingPageProps = {
  params: Promise<{ id: string }>;
};

export default async function NewMeetingPage({ params }: NewMeetingPageProps) {
  const { id } = await params;
  const workspace = await getCareerCaseWorkspace(id);

  if (!workspace) {
    notFound();
  }

  return (
    <PageShell
      title="Create Session"
      description={`Log a new mentoring session for ${workspace.mentee.fullName}.`}
    >
      <div className="mb-6">
        <Link href={`/career-cases/${id}?tab=meetings`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="size-4" />
            Back to Sessions
          </Button>
        </Link>
      </div>
      <div className="max-w-2xl">
        <CreateMeetingPage careerCaseId={id} />
      </div>
    </PageShell>
  );
}
