import { PageShell } from "@/components/layout/page-shell";
import { EmptyPage } from "@/components/layout/empty-page";

export default function SettingsPage() {
  return (
    <PageShell
      title="Settings"
      description="Configure your mentor workspace preferences."
    >
      <EmptyPage
        title="Settings are planned for a future release"
        description="Authentication, notifications, and workspace preferences will be added after the MVP."
        action={{ label: "Back to Dashboard", href: "/" }}
      />
    </PageShell>
  );
}
