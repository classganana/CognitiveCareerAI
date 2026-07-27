import { AppHeader } from "@/components/layout/app-header";

type PageShellProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function PageShell({ title, description, children }: PageShellProps) {
  return (
    <>
      <AppHeader title={title} description={description} />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </>
  );
}
