"use client";

import { useLivingDonors } from "@/features/organ/hooks/use-organ";
import { DataTableShell } from "@/components/data-display/data-table-shell";
import { StatusBadge } from "@/components/data-display/status-badge";
import { formatDateTime } from "@/lib/utils/date";
import { ShieldCheck } from "lucide-react";

export function LivingDonorTable() {
  const { data: donorsRes, isLoading, error } = useLivingDonors();

  const donors = donorsRes?.items || [];
  const errorMessage = error instanceof Error ? error.message : typeof error === "string" ? error : undefined;

  return (
    <DataTableShell
      title="Living Donor Registry"
      description="Staff view of living donor registrations. Private details are restricted. Screening status is preliminary and does not represent final medical clearance."
      isLoading={isLoading}
      error={errorMessage}
      isEmpty={!isLoading && donors.length === 0}
      emptyTitle="No living donors registered"
      emptyDescription="There are currently no active living donor registrations in the system."
    >
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="border-b border-border bg-slate-50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Anonymous Reference</th>
              <th className="px-4 py-3 font-medium">Organ Interest</th>
              <th className="px-4 py-3 font-medium">Blood Group</th>
              <th className="px-4 py-3 font-medium">Screening Status</th>
              <th className="px-4 py-3 font-medium">Registered At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-white">
            {donors.map((donor) => (
              <tr key={donor.id} className="group hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 align-top">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-600" aria-label="Privacy Protected" />
                    <span className="font-mono text-slate-700">{donor.anonymousReference}</span>
                  </div>
                </td>
                <td className="px-4 py-3 align-top">
                  <span className="font-medium text-slate-900 capitalize">{donor.organInterest.toLowerCase()}</span>
                </td>
                <td className="px-4 py-3 align-top">
                  <span className="text-slate-700">{donor.bloodGroup || <span className="text-muted-foreground italic text-xs">Pending</span>}</span>
                </td>
                <td className="px-4 py-3 align-top">
                  <StatusBadge 
                    label={
                      donor.screeningStatus === "ELIGIBLE" ? "Screening criteria met" :
                      donor.screeningStatus === "INELIGIBLE" ? "Screening criteria not met" :
                      "Screening pending"
                    }
                    tone={
                      donor.screeningStatus === "ELIGIBLE" ? "success" : 
                      donor.screeningStatus === "INELIGIBLE" ? "critical" : 
                      "warning"
                    } 
                  />
                </td>
                <td className="px-4 py-3 align-top">
                  <span className="text-slate-600">{formatDateTime(donor.registeredAt)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DataTableShell>
  );
}
