import type { StatusTone } from "@/contracts/common";
import { StatusBadge } from "./status-badge";

export function StatusPill({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: StatusTone;
}) {
  return <StatusBadge label={label} tone={tone} />;
}
