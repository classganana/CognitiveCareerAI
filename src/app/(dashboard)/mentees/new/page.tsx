import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { CreateMenteePage } from "@/features/mentees/components/create-mentee-page";

export default function NewMenteePage() {
  return (
    <PageShell
      title="Add Mentee"
      description="Create a new mentee profile and career case workspace."
    >
      <div className="mb-6">
        <Link href="/mentees">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="size-4" />
            Back to Mentees
          </Button>
        </Link>
      </div>
      <div className="max-w-2xl">
        <CreateMenteePage />
      </div>
    </PageShell>
  );
}
