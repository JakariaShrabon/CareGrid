"use client";

import { useEffect, useState, useMemo } from "react";
import { cn } from "@/lib/utils/cn";
import { Clock, AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";

type CountdownStatus = "SAFE" | "WARNING" | "CRITICAL" | "EXPIRED" | "DELIVERED";

interface IschemiaCountdownProps {
  expiresAt: string;
  initialStatus: CountdownStatus;
}

export function IschemiaCountdown({ expiresAt, initialStatus }: IschemiaCountdownProps) {
  const targetDate = useMemo(() => new Date(expiresAt).getTime(), [expiresAt]);
  
  const [timeLeft, setTimeLeft] = useState<number>(() => {
    return Math.max(0, targetDate - Date.now());
  });

  // Live status respects API authority but transitions to EXPIRED at zero
  const liveStatus: CountdownStatus = useMemo(() => {
    if (initialStatus === "DELIVERED") return "DELIVERED";
    if (timeLeft <= 0) return "EXPIRED";
    return initialStatus;
  }, [timeLeft, initialStatus]);

  useEffect(() => {
    if (liveStatus === "EXPIRED" || liveStatus === "DELIVERED") return;

    const interval = setInterval(() => {
      const remaining = Math.max(0, targetDate - Date.now());
      setTimeLeft(remaining);
      
      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate, liveStatus]);

  const formatTime = (ms: number) => {
    if (ms <= 0) return "00:00:00";
    
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return [
      hours.toString().padStart(2, "0"),
      minutes.toString().padStart(2, "0"),
      seconds.toString().padStart(2, "0"),
    ].join(":");
  };

  const getStatusStyles = () => {
    switch (liveStatus) {
      case "SAFE":
        return { wrapper: "bg-emerald-50 border-emerald-200 text-emerald-800", icon: Clock, label: "Preservation Safe" };
      case "WARNING":
        return { wrapper: "bg-amber-50 border-amber-200 text-amber-800", icon: AlertTriangle, label: "Window Approaching" };
      case "CRITICAL":
        return { wrapper: "bg-rose-50 border-rose-200 text-rose-800", icon: ShieldAlert, label: "Critical Window" };
      case "EXPIRED":
        return { wrapper: "bg-slate-100 border-slate-300 text-slate-600", icon: AlertTriangle, label: "Expired" };
      case "DELIVERED":
        return { wrapper: "bg-sky-50 border-sky-200 text-sky-800", icon: CheckCircle2, label: "Delivered" };
      default:
        return { wrapper: "bg-slate-50 border-slate-200 text-slate-800", icon: Clock, label: "Unknown" };
    }
  };

  const styles = getStatusStyles();
  const Icon = styles.icon;

  return (
    <div className={cn("inline-flex flex-col rounded-md border p-3 min-w-[200px]", styles.wrapper)}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-4 w-4" aria-hidden="true" />
        <span className="text-xs font-semibold uppercase tracking-wider">{styles.label}</span>
      </div>
      <div className="font-mono text-2xl font-bold tracking-tight tabular-nums">
        {liveStatus === "DELIVERED" ? "---" : formatTime(timeLeft)}
      </div>
    </div>
  );
}
