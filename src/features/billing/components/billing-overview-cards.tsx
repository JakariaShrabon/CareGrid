"use client";

import { useBills, useInsuranceClaims, useDischarges } from "../hooks/use-billing";
import { StatCard } from "@/components/data-display/stat-card";
import { AlertCircle, FileText, Activity, Users } from "lucide-react";
import { formatMoney } from "@/lib/utils/currency";

export function BillingOverviewCards() {
  const { data: billsData } = useBills();
  const { data: claimsData } = useInsuranceClaims();
  const { data: dischargesData } = useDischarges();

  // Simple derivations for operational dashboard
  const openBills = billsData?.items.filter(b => b.status === "DRAFT" || b.status === "ISSUED" || b.status === "PARTIALLY_PAID") || [];
  const pendingClaims = claimsData?.items.filter(c => c.status === "PENDING" || c.status === "SUBMITTED" || c.status === "UNDER_REVIEW") || [];
  const readyForDischarge = dischargesData?.items.filter(d => d.status === "FINALIZED") || [];

  const totalOutstanding = openBills.reduce((acc, bill) => {
    // Note: React does not calculate this authoritatively, we are just summing up mock API values for display
    return acc + Number(bill.patientPayable.amount || 0);
  }, 0);

  const mockCurrency = openBills.length > 0 ? openBills[0].patientPayable.currency : "BDT";

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Open Bills"
        value={openBills.length.toString()}
        icon={FileText}
        
      />
      <StatCard
        title="Total Outstanding"
        value={formatMoney({ amount: totalOutstanding.toString(), currency: mockCurrency })}
        icon={Activity}
        
      />
      <StatCard
        title="Pending Claims"
        value={pendingClaims.length.toString()}
        icon={AlertCircle}
        
      />
      <StatCard
        title="Discharges Ready"
        value={readyForDischarge.length.toString()}
        icon={Users}
        
      />
    </div>
  );
}
