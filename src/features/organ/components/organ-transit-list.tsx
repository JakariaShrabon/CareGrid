"use client";

import { useOrganTransit } from "@/features/organ/hooks/use-organ";
import { DataTableShell } from "@/components/data-display/data-table-shell";
import { IschemiaCountdown } from "@/features/organ/components/ischemia-countdown";
import { formatDateTime } from "@/lib/utils/date";
import { MapPin } from "lucide-react";

export function OrganTransitList() {
  const { data: transitRes, isLoading, error } = useOrganTransit();

  const transits = transitRes?.items || [];
  const errorMessage = error instanceof Error ? error.message : typeof error === "string" ? error : undefined;

  return (
    <DataTableShell
      title="Cold-Ischemia Tracker"
      description="Active monitoring of in-transit organs and their preservation windows."
      isLoading={isLoading}
      error={errorMessage}
      isEmpty={!isLoading && transits.length === 0}
      emptyTitle="No organs in transit"
      emptyDescription="There are currently no active organ transits."
    >
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="border-b border-border bg-slate-50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Organ Type</th>
              <th className="px-4 py-3 font-medium">Time Window</th>
              <th className="px-4 py-3 font-medium">Route</th>
              <th className="px-4 py-3 font-medium">Related Parties</th>
              <th className="px-4 py-3 font-medium text-right">Live Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-white">
            {transits.map((transit) => (
              <tr key={transit.id} className="group hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 align-top">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900 capitalize text-base">{transit.organType.toLowerCase()}</span>
                    <span className="text-xs text-muted-foreground mt-1">ID: {transit.id.substring(0, 8)}</span>
                  </div>
                </td>
                <td className="px-4 py-3 align-top">
                  <div className="flex flex-col gap-1 text-sm">
                    <span className="text-slate-600">
                      <span className="font-medium">Retrieved:</span> {formatDateTime(transit.retrievedAt)}
                    </span>
                    <span className="text-slate-600">
                      <span className="font-medium">Expires:</span> {formatDateTime(transit.expiresAt)}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 align-top">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start gap-1.5">
                      <MapPin className="h-4 w-4 text-slate-400 mt-0.5 shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground uppercase">Origin</span>
                        <span className="text-slate-700">{transit.originHospitalId}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <MapPin className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                      <div className="flex flex-col">
                        <span className="text-xs text-emerald-700 uppercase">Destination</span>
                        <span className="text-slate-700 font-medium">{transit.destinationHospitalId}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 align-top">
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-600"><span className="text-muted-foreground text-xs">Donor Ref:</span> {transit.donorId}</span>
                    {transit.recipientId ? (
                      <span className="text-slate-600"><span className="text-muted-foreground text-xs">Recipient ID:</span> {transit.recipientId}</span>
                    ) : (
                      <span className="text-slate-400 italic text-xs">No recipient linked</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 align-top text-right">
                  <IschemiaCountdown 
                    expiresAt={transit.expiresAt} 
                    initialStatus={transit.status} 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DataTableShell>
  );
}
