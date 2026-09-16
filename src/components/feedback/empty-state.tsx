import { Inbox, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: ReactNode;
};

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed border-cyan-200/80 bg-gradient-to-br from-white via-cyan-50/70 to-emerald-50/60 p-6 text-center shadow-sm">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-100 to-emerald-100 text-cyan-700 shadow-sm ring-1 ring-cyan-200/80">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <h2 className="text-base font-semibold text-foreground">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
