import { AlertTriangle, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export function ErrorState({
  title,
  description,
  icon: Icon = AlertTriangle,
  action,
}: {
  title: string;
  description: string;
  icon?: LucideIcon;
  action?: ReactNode;
}) {
  return (
    <div
      role="alert"
      className="flex min-h-44 flex-col items-center justify-center rounded-lg border border-rose-200/80 bg-gradient-to-br from-white via-rose-50/80 to-amber-50/70 p-6 text-center shadow-sm"
    >
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-rose-100 to-amber-100 text-rose-700 shadow-sm ring-1 ring-rose-200/80">
        <Icon className="h-5 w-5" aria-hidden />
      </div>
      <h2 className="text-base font-semibold text-red-950">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-red-800">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
