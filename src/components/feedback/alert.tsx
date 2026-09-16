import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";

import type { StatusTone } from "@/contracts/common";
import { cn } from "@/lib/utils/cn";

const alertStyles: Record<StatusTone, string> = {
  neutral: "border-slate-200 bg-white text-slate-700",
  info: "border-sky-200 bg-sky-50 text-sky-800",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-900",
  critical: "border-red-200 bg-red-50 text-red-800",
};

const alertIcons = {
  neutral: Info,
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  critical: AlertCircle,
};

export function Alert({
  tone = "info",
  title,
  children,
}: {
  tone?: StatusTone;
  title: string;
  children?: ReactNode;
}) {
  const Icon = alertIcons[tone];
  return (
    <div className={cn("rounded-lg border p-4", alertStyles[tone])}>
      <div className="flex gap-3">
        <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
        <div className="min-w-0">
          <p className="text-sm font-semibold">{title}</p>
          {children ? <div className="mt-1 text-sm leading-5">{children}</div> : null}
        </div>
      </div>
    </div>
  );
}
