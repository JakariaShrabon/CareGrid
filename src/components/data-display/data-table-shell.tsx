import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

import { EmptyState } from "../feedback/empty-state";
import { ErrorState } from "../feedback/error-state";
import { LoadingState } from "../feedback/loading-state";

export function DataTableShell({
  title,
  description,
  toolbar,
  children,
  pagination,
  isLoading = false,
  error,
  isEmpty = false,
  emptyTitle = "No records found",
  emptyDescription = "There are no records to show for this view.",
  className,
}: {
  title?: string;
  description?: string;
  toolbar?: ReactNode;
  children: ReactNode;
  pagination?: ReactNode;
  isLoading?: boolean;
  error?: string;
  isEmpty?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  className?: string;
}) {
  return (
    <div
      data-caregrid-surface="table-shell"
      className={cn(
        "overflow-hidden rounded-lg border border-cyan-100/80 bg-gradient-to-br from-white via-cyan-50/40 to-emerald-50/40 shadow-sm",
        className,
      )}
    >
      {(title || description || toolbar) ? (
        <div className="flex flex-col gap-3 border-b border-cyan-100/80 bg-gradient-to-r from-white via-cyan-50/70 to-emerald-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            {title ? <h2 className="text-base font-semibold text-slate-950">{title}</h2> : null}
            {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
          </div>
          {toolbar ? <div className="flex shrink-0 flex-wrap gap-2">{toolbar}</div> : null}
        </div>
      ) : null}
      {isLoading ? (
        <LoadingState label="Loading records" />
      ) : error ? (
        <div className="p-4">
          <ErrorState title="Unable to load records" description={error} />
        </div>
      ) : isEmpty ? (
        <div className="p-4">
          <EmptyState title={emptyTitle} description={emptyDescription} />
        </div>
      ) : (
        <div className="overflow-x-auto bg-white/80">{children}</div>
      )}
      {pagination ? <div className="border-t border-cyan-100/80 bg-white/80 p-3">{pagination}</div> : null}
    </div>
  );
}
