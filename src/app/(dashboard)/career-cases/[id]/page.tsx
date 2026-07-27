import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { CareerCaseWorkspace } from "@/features/career-cases/components/career-case-workspace";
import { isCareerCaseWorkspaceTab } from "@/features/career-cases/types";
import { getCareerCaseWorkspace } from "@/services/career-case.service";

export const dynamic = "force-dynamic";

type CareerCasePageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
};

export default async function CareerCasePage({
  params,
  searchParams,
}: CareerCasePageProps) {
  const { id } = await params;
  const { tab } = await searchParams;
  const data = await getCareerCaseWorkspace(id);

  if (!data) {
    notFound();
  }

  const initialTab = isCareerCaseWorkspaceTab(tab) ? tab : "overview";

  return (
    <PageShell
      title={data.careerCase.title}
      description={`Career case workspace for ${data.mentee.fullName}`}
    >
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Link href={`/mentees/${data.mentee._id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="size-4" />
            Back to Mentee
          </Button>
        </Link>
        <Link href="/mentees">
          <Button variant="outline" size="sm">
            All Mentees
          </Button>
        </Link>
      </div>

      <Suspense fallback={<div className="text-sm text-muted-foreground">Loading workspace...</div>}>
        <CareerCaseWorkspace data={data} initialTab={initialTab} />
      </Suspense>
    </PageShell>
  );
}
