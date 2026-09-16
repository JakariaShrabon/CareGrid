import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

import type { StatusTone } from "@/contracts/common";
import { cn } from "@/lib/utils/cn";

import { StatusBadge } from "./status-badge";

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  statusLabel,
  statusTone = "neutral",
  className,
}: {
  title: string;
  value: string | number | null | undefined;
  icon?: LucideIcon;
  description?: string;
  trend?: ReactNode;
  statusLabel?: string;
  statusTone?: StatusTone;
  className?: string;
}) {
  const displayValue = value === null || value === undefined || value === "" ? "—" : value;

  return (
    <div
      data-caregrid-surface="stat-card"
      className={cn(
        "rounded-lg border border-cyan-100/80 bg-gradient-to-br from-white via-cyan-50/60 to-emerald-50/50 p-5 shadow-sm",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-semibold tracking-normal text-slate-950">
            {displayValue}
          </p>
        </div>
        {Icon ? (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-100 to-emerald-100 text-cyan-700 shadow-sm ring-1 ring-cyan-200/80">
            <Icon className="h-5 w-5" aria-hidden />
          </div>
        ) : null}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {statusLabel ? <StatusBadge label={statusLabel} tone={statusTone} /> : null}
        {trend ? <span className="text-xs font-medium text-muted-foreground">{trend}</span> : null}
      </div>
      {description ? (
        <p className="mt-3 text-sm leading-5 text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
