import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Briefcase, Pencil } from "lucide-react";

import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { MenteeSummaryCards } from "@/features/mentees/components/mentee-summary-cards";
import { getMenteeById } from "@/services/mentee.service";

export const dynamic = "force-dynamic";

type MenteeDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function MenteeDetailPage({ params }: MenteeDetailPageProps) {
  const { id } = await params;
  const data = await getMenteeById(id);

  if (!data) {
    notFound();
  }

  return (
    <PageShell
      title={data.mentee.fullName}
      description="Mentee profile and career case summary."
    >
      <div className="mb-6 flex items-center justify-between gap-4">
        <Link href="/mentees">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="size-4" />
            Back to Mentees
          </Button>
        </Link>
        <div className="flex flex-wrap gap-2">
          {data.careerCase ? (
            <Link href={`/career-cases/${data.careerCase._id}`}>
              <Button size="sm">
                <Briefcase className="size-4" />
                Open Career Case
              </Button>
            </Link>
          ) : null}
          <Link href={`/mentees/${data.mentee._id}/edit`}>
            <Button variant="outline" size="sm">
              <Pencil className="size-4" />
              Edit Mentee
            </Button>
          </Link>
        </div>
      </div>
      <MenteeSummaryCards data={data} />
    </PageShell>
  );
}
