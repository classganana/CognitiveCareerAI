import { Skeleton } from "@/components/ui/skeleton";

type CardGridSkeletonProps = {
  count?: number;
};

export function CardGridSkeleton({ count = 4 }: CardGridSkeletonProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="space-y-4 rounded-xl border p-6">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
          </div>
          <Skeleton className="h-4 w-full" />
        </div>
      ))}
    </div>
  );
}
