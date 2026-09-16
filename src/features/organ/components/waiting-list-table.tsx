"use client";

import { useWaitingList } from "@/features/organ/hooks/use-organ";
import { DataTableShell } from "@/components/data-display/data-table-shell";
import { StatusBadge } from "@/components/data-display/status-badge";
import { formatDateTime } from "@/lib/utils/date";

export function WaitingListTable() {
  const { data: waitingListRes, isLoading, error } = useWaitingList();

  const entries = waitingListRes?.items || [];
  const errorMessage = error instanceof Error ? error.message : typeof error === "string" ? error : undefined;

  return (
    <DataTableShell
      title="Recipient Waiting List"
      description="Clinical queue prioritized by urgency and wait time. Driven by backend matching engine."
      isLoading={isLoading}
      error={errorMessage}
      isEmpty={!isLoading && entries.length === 0}
      emptyTitle="Waiting list empty"
      emptyDescription="There are currently no patients on the organ waiting list."
    >
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="border-b border-border bg-slate-50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Rank</th>
              <th className="px-4 py-3 font-medium">Recipient ID</th>
              <th className="px-4 py-3 font-medium">Organ / Blood</th>
              <th className="px-4 py-3 font-medium">Clinical Urgency</th>
              <th className="px-4 py-3 font-medium">Time Waiting</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-white">
            {entries.map((entry) => (
              <tr key={entry.id} className="group hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 align-top">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-700">
                    {entry.priorityRank}
                  </div>
                </td>
                <td className="px-4 py-3 align-top">
                  <span className="font-medium text-slate-900">{entry.recipientId}</span>
                </td>
                <td className="px-4 py-3 align-top">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900 capitalize">{entry.organType.toLowerCase()}</span>
                    <span className="text-xs text-muted-foreground">Blood: {entry.bloodGroup}</span>
                  </div>
                </td>
                <td className="px-4 py-3 align-top">
                  <div className="flex flex-col">
                    <span className="font-medium text-amber-700">{entry.urgencyLabel}</span>
                    {entry.meldScore !== undefined && (
                      <span className="text-xs text-muted-foreground">MELD: {entry.meldScore}</span>
                    )}
                    {entry.peldScore !== undefined && (
                      <span className="text-xs text-muted-foreground">PELD: {entry.peldScore}</span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 align-top">
                  <div className="flex flex-col">
                    <span className="text-slate-700">{entry.daysWaiting} days</span>
                    <span className="text-xs text-muted-foreground">Since: {formatDateTime(entry.waitingSince).split(' ')[0]}</span>
                  </div>
                </td>
                <td className="px-4 py-3 align-top">
                  <StatusBadge 
                    label={entry.status}
                    tone={entry.status === "ACTIVE" ? "success" : entry.status === "MATCHED" ? "success" : "neutral"} 
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
