"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { CurrentMentor } from "@/lib/mentor/default-mentor";

type AppHeaderProps = {
  title: string;
  description?: string;
};

export function AppHeader({ title, description }: AppHeaderProps) {
  const router = useRouter();
  const [mentor, setMentor] = useState<CurrentMentor>({
    id: "",
    displayName: "Mentor",
    initials: "MN",
    email: "",
  });

  useEffect(() => {
    async function loadMentor() {
      try {
        const response = await fetch("/api/mentor/current");
        const payload = await response.json();

        if (response.ok && payload.data) {
          setMentor(payload.data as CurrentMentor);
        }
      } catch {
        // Keep fallback mentor label if the request fails.
      }
    }

    loadMentor();
  }, []);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-6">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="size-4" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="gap-2 px-2">
                <Avatar className="size-8">
                  <AvatarFallback>{mentor.initials}</AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium sm:inline">
                  {mentor.displayName}
                </span>
                <ChevronDown className="size-4 text-muted-foreground" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>{mentor.displayName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/settings")}>
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                toast.info("Sign out is not available in the demo workspace.")
              }
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
