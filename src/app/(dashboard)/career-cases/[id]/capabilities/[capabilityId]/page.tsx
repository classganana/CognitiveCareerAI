import { notFound } from "next/navigation";

import { PageShell } from "@/components/layout/page-shell";
import { CapabilityDetailPage } from "@/features/capabilities/components/capability-detail-page";
import { getCapabilityDetails } from "@/services/capability.service";
import { getCareerCaseWorkspace } from "@/services/career-case.service";

export const dynamic = "force-dynamic";

type CapabilityDetailRouteProps = {
  params: Promise<{ id: string; capabilityId: string }>;
};

export default async function CapabilityDetailRoute({
  params,
}: CapabilityDetailRouteProps) {
  const { id, capabilityId } = await params;

  const [workspace, capability] = await Promise.all([
    getCareerCaseWorkspace(id),
    getCapabilityDetails(id, capabilityId),
  ]);

  if (!workspace || !capability) {
    notFound();
  }

  return (
    <PageShell
      title={capability.name}
      description={`Capability assessment for ${workspace.mentee.fullName}`}
    >
      <CapabilityDetailPage careerCaseId={id} capability={capability} />
    </PageShell>
  );
}
