import { cn } from "@/lib/utils/cn";

export function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-gradient-to-r from-slate-200 via-cyan-100/80 to-slate-200",
        className,
      )}
    />
  );
}

export function LoadingState({ label = "Loading" }: { label?: string }) {
  return (
    <div
      className="space-y-3 rounded-lg border border-cyan-100/80 bg-gradient-to-br from-white via-cyan-50/60 to-emerald-50/50 p-4 shadow-sm"
      aria-busy="true"
      aria-label={label}
    >
      <SkeletonBlock className="h-4 w-40" />
      <SkeletonBlock className="h-10 w-full" />
      <SkeletonBlock className="h-10 w-full" />
      <SkeletonBlock className="h-10 w-2/3" />
    </div>
  );
}
