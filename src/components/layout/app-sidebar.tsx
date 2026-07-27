"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrainCircuit } from "lucide-react";

import { cn } from "@/lib/utils";
import { mainNavigation } from "@/lib/navigation";
import { Separator } from "@/components/ui/separator";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-2 px-6">
        <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
          <BrainCircuit className="size-4" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">Cognitive Career AI</p>
          <p className="truncate text-xs text-muted-foreground">Case Management</p>
        </div>
      </div>

      <Separator />

      <nav className="flex flex-1 flex-col gap-1 p-4">
        {mainNavigation.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <p className="text-xs text-muted-foreground">Mentor-first platform</p>
      </div>
    </aside>
  );
}
