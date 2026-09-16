"use client";

import { useBloodOverview } from "../hooks/use-blood-bank";
import { StatCard } from "@/components/data-display/stat-card";
import { Droplets, AlertTriangle, Users, HeartPulse } from "lucide-react";
import { LoadingState } from "@/components/feedback/loading-state";
import { ErrorState } from "@/components/feedback/error-state";

export function BloodOverviewCards() {
  const { data, isLoading, error, refetch } = useBloodOverview();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <LoadingState key={i} label="Loading metric..." />
        ))}
      </div>
    );
  }

  if (error || !data) {
    return (
      <ErrorState 
        title="Failed to load overview" 
        description={error instanceof Error ? error.message : "Unknown error"} 
        action={<button onClick={() => refetch()} className="text-sm font-medium text-red-600 hover:text-red-500">Retry</button>}
      />
    );
  }

  const { totalUnits, availableUnits, activeSos, donors } = data;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Units"
        value={totalUnits.toString()}
        icon={Droplets}
        trend="Current Inventory"
      />
      <StatCard
        title="Available Units"
        value={availableUnits.toString()}
        icon={HeartPulse}
        trend="Ready for Dispense"
      />
      <StatCard
        title="Active SOS Requests"
        value={activeSos.toString()}
        icon={AlertTriangle}
        trend="Urgent Requirements"
        className={activeSos > 0 ? "border-rose-200 bg-rose-50" : ""}
      />
      <StatCard
        title="Registered Donors"
        value={donors.toString()}
        icon={Users}
        trend="Total Network"
      />
    </div>
  );
}
