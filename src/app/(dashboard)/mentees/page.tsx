import { PageShell } from "@/components/layout/page-shell";
import { MenteeList } from "@/features/mentees/components/mentee-list";
import { listMenteesWithCareerCases } from "@/services/career-case.service";

export const dynamic = "force-dynamic";

export default async function MenteesPage() {
  const mentees = await listMenteesWithCareerCases();

  return (
    <PageShell
      title="Mentees"
      description="Manage mentee profiles and career cases."
    >
      <MenteeList initialMentees={mentees} />
    </PageShell>
  );
}
