"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type DashboardErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

function isChunkLoadError(error: Error) {
  return (
    error.name === "ChunkLoadError" ||
    error.message.includes("Loading chunk") ||
    error.message.includes("Failed to fetch dynamically imported module")
  );
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const chunkError = isChunkLoadError(error);

  return (
    <div className="flex flex-1 items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {chunkError ? "Page update required" : "Something went wrong"}
          </CardTitle>
          <CardDescription>
            {chunkError
              ? "The app was updated while this page was open. Reload to fetch the latest version."
              : "An unexpected error occurred while loading this page."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Button
            onClick={() => {
              if (chunkError) {
                window.location.reload();
                return;
              }

              reset();
            }}
          >
            {chunkError ? "Reload page" : "Try again"}
          </Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
