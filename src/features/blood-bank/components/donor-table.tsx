"use client";

import { useBloodDonors } from "../hooks/use-blood-bank";
import { DataTableShell } from "@/components/data-display/data-table-shell";
import { StatusBadge } from "@/components/data-display/status-badge";
import { formatDate } from "@/lib/utils/date";
import { ShieldCheck } from "lucide-react";

export function DonorTable() {
  const { data, isLoading, error } = useBloodDonors();

  const donors = data?.items || [];
  const errorMessage = error instanceof Error ? error.message : typeof error === "string" ? error : undefined;

  return (
    <DataTableShell
      title="Donor Directory"
      description="Registered operational donor network. Detailed personal medical history is restricted for privacy."
      isLoading={isLoading}
      error={errorMessage}
      isEmpty={!isLoading && donors.length === 0}
      emptyTitle="No donors found"
      emptyDescription="There are currently no registered donors matching the query."
    >
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="border-b border-border bg-slate-50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Donor Reference</th>
              <th className="px-4 py-3 font-medium">Blood Group</th>
              <th className="px-4 py-3 font-medium">Distance</th>
              <th className="px-4 py-3 font-medium">Last Donation</th>
              <th className="px-4 py-3 font-medium">Eligibility</th>
              <th className="px-4 py-3 font-medium">Next Eligible</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-white">
            {donors.map((donor) => (
              <tr key={donor.id} className="group hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 align-top">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" aria-label="Privacy Protected" />
                    <span className="font-medium text-slate-900">{donor.displayName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 align-top font-semibold text-rose-700">
                  {donor.bloodGroup}
                </td>
                <td className="px-4 py-3 align-top text-slate-600">
                  {donor.distanceKm !== undefined ? `${donor.distanceKm} km` : "-"}
                </td>
                <td className="px-4 py-3 align-top text-slate-600">
                  {donor.lastDonationAt ? formatDate(donor.lastDonationAt) : "No record"}
                </td>
                <td className="px-4 py-3 align-top">
                  <StatusBadge 
                    label={donor.eligible ? "Eligible" : "Not currently eligible"}
                    tone={donor.eligible ? "success" : "warning"}
                  />
                </td>
                <td className="px-4 py-3 align-top text-slate-600">
                  {!donor.eligible && donor.nextEligibleAt ? formatDate(donor.nextEligibleAt) : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DataTableShell>
  );
}
