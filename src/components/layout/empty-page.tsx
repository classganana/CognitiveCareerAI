import Link from "next/link";

import { Button } from "@/components/ui/button";

type EmptyPageProps = {
  title: string;
  description: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
};

export function EmptyPage({ title, description, action }: EmptyPageProps) {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed bg-muted/30 px-6 py-12 text-center">
      <h2 className="text-base font-medium">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      {action ? (
        <div className="mt-6">
          {action.href ? (
            <Link href={action.href}>
              <Button>{action.label}</Button>
            </Link>
          ) : (
            <Button onClick={action.onClick}>{action.label}</Button>
          )}
        </div>
      ) : null}
    </div>
  );
}
