"use client";

import { Activity, AlertTriangle, PackageOpen, Pill } from "lucide-react";
import { StatCard } from "@/components/data-display/stat-card";
import { LoadingState } from "@/components/feedback/loading-state";
import { usePrescriptions, usePharmacyInventory } from "../hooks/use-pharmacy";

export function PharmacyOverviewCards() {
  const { data: rxResponse, isLoading: loadingRx } = usePrescriptions();
  const { data: invResponse, isLoading: loadingInv } = usePharmacyInventory();

  if (loadingRx || loadingInv) {
    return <LoadingState label="Loading pharmacy metrics..." />;
  }

  const prescriptions = rxResponse?.items || [];
  const inventory = invResponse?.items || [];

  const pendingCount = prescriptions.filter(p => ["DRAFT", "PENDING", "REVIEWED", "READY"].includes(p.status)).length;
  
  // A simplistic approach to "Dispensed Today" based on status for mock data
  const dispensedCount = prescriptions.filter(p => p.status === "DISPENSED").length;

  const lowStockCount = inventory.filter(i => i.status === "WARNING" || i.status === "CRITICAL").length;

  const warningsCount = prescriptions.filter(p => 
    p.safetySummary?.status === "ALLERGY_WARNING" || 
    p.safetySummary?.status === "INTERACTION_WARNING" || 
    p.safetySummary?.status === "MULTIPLE_WARNINGS"
  ).length;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Pending Prescriptions"
        value={pendingCount.toString()}
        icon={Activity}
        description="Awaiting dispense"
      />
      <StatCard
        title="Dispensed"
        value={dispensedCount.toString()}
        icon={Pill}
        description="Prescriptions dispensed"
      />
      <StatCard
        title="Safety Warnings"
        value={warningsCount.toString()}
        icon={AlertTriangle}
        description="Prescriptions with flags"
      />
      <StatCard
        title="Low Stock Items"
        value={lowStockCount.toString()}
        icon={PackageOpen}
        description="Inventory requires attention"
      />
    </div>
  );
}
