import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  Circle,
  PauseCircle,
  ShieldCheck,
  XCircle,
  type LucideIcon,
} from "lucide-react";

import type { StatusTone } from "@/contracts/common";
import { cn } from "@/lib/utils/cn";

export type CareGridStatus =
  | "AVAILABLE"
  | "OCCUPIED"
  | "CLEANING"
  | "RESERVED"
  | "SAFE"
  | "WARNING"
  | "CRITICAL"
  | "EXPIRED"
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "ACTIVE"
  | "INACTIVE"
  | "DISPENSED"
  | "CANCELLED"
  | "DRAFT"
  | "REVIEWED"
  | "READY"
  | "ALLERGY_WARNING"
  | "INTERACTION_WARNING"
  | "MULTIPLE_WARNINGS";

type StatusDefinition = {
  label: string;
  tone: StatusTone;
  icon: LucideIcon;
};

const statusDefinitions: Record<CareGridStatus, StatusDefinition> = {
  AVAILABLE: { label: "Available", tone: "success", icon: CheckCircle2 },
  OCCUPIED: { label: "Occupied", tone: "info", icon: Circle },
  CLEANING: { label: "Cleaning", tone: "warning", icon: Clock3 },
  RESERVED: { label: "Reserved", tone: "neutral", icon: PauseCircle },
  SAFE: { label: "Safe", tone: "success", icon: ShieldCheck },
  WARNING: { label: "Warning", tone: "warning", icon: AlertCircle },
  CRITICAL: { label: "Critical", tone: "critical", icon: AlertCircle },
  EXPIRED: { label: "Expired", tone: "critical", icon: XCircle },
  PENDING: { label: "Pending", tone: "warning", icon: Clock3 },
  APPROVED: { label: "Approved", tone: "success", icon: CheckCircle2 },
  REJECTED: { label: "Rejected", tone: "critical", icon: XCircle },
  ACTIVE: { label: "Active", tone: "success", icon: CheckCircle2 },
  INACTIVE: { label: "Inactive", tone: "neutral", icon: Circle },
  DISPENSED: { label: "Dispensed", tone: "success", icon: CheckCircle2 },
  CANCELLED: { label: "Cancelled", tone: "neutral", icon: XCircle },
  DRAFT: { label: "Draft", tone: "neutral", icon: Circle },
  REVIEWED: { label: "Reviewed", tone: "info", icon: CheckCircle2 },
  READY: { label: "Ready", tone: "success", icon: CheckCircle2 },
  ALLERGY_WARNING: { label: "Allergy", tone: "warning", icon: AlertCircle },
  INTERACTION_WARNING: { label: "Interaction", tone: "warning", icon: AlertCircle },
  MULTIPLE_WARNINGS: { label: "Warnings", tone: "critical", icon: AlertCircle },
};

const toneClasses: Record<StatusTone, string> = {
  neutral: "bg-slate-100 text-slate-700 ring-slate-200",
  info: "bg-sky-50 text-sky-700 ring-sky-200",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  warning: "bg-amber-50 text-amber-800 ring-amber-200",
  critical: "bg-red-50 text-red-700 ring-red-200",
};

export function getStatusDefinition(status: CareGridStatus): StatusDefinition {
  return statusDefinitions[status];
}

export function StatusBadge({
  status,
  label,
  tone,
  className,
}: {
  status?: CareGridStatus;
  label?: string;
  tone?: StatusTone;
  className?: string;
}) {
  const definition = status ? getStatusDefinition(status) : undefined;
  const resolvedTone = tone ?? definition?.tone ?? "neutral";
  const resolvedLabel = label ?? definition?.label ?? "Status";
  const Icon = definition?.icon ?? Circle;

  return (
    <span
      data-tone={resolvedTone}
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-md px-2 text-xs font-medium ring-1 ring-inset",
        toneClasses[resolvedTone],
        className,
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      <span>{resolvedLabel}</span>
    </span>
  );
}
