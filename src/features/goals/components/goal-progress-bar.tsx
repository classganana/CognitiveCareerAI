import type { GoalProgress } from "@/features/goals/lib/serialize-goal";

type GoalProgressBarProps = {
  progress: GoalProgress;
  showLabel?: boolean;
};

export function GoalProgressBar({
  progress,
  showLabel = true,
}: GoalProgressBarProps) {
  return (
    <div className="space-y-2">
      {showLabel ? (
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {progress.completedTasks} of {progress.totalTasks} tasks complete
          </span>
          <span className="font-medium">{progress.percentage}%</span>
        </div>
      ) : null}
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${progress.percentage}%` }}
        />
      </div>
    </div>
  );
}
