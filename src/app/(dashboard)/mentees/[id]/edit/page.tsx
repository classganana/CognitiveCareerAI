import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { PageShell } from "@/components/layout/page-shell";
import { Button } from "@/components/ui/button";
import { EditMenteePage } from "@/features/mentees/components/edit-mentee-page";
import { getMenteeById } from "@/services/mentee.service";

export const dynamic = "force-dynamic";

type EditMenteeRouteProps = {
  params: Promise<{ id: string }>;
};

export default async function EditMenteeRoute({ params }: EditMenteeRouteProps) {
  const { id } = await params;
  const data = await getMenteeById(id);

  if (!data) {
    notFound();
  }

  return (
    <PageShell
      title={`Edit ${data.mentee.fullName}`}
      description="Update mentee profile information."
    >
      <div className="mb-6">
        <Link href={`/mentees/${data.mentee._id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="size-4" />
            Back to Profile
          </Button>
        </Link>
      </div>
      <div className="max-w-2xl">
        <EditMenteePage mentee={data.mentee} />
      </div>
    </PageShell>
  );
}
