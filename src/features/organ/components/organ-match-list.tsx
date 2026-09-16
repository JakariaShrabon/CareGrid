"use client";

import { useOrganMatches } from "@/features/organ/hooks/use-organ";
import { DataTableShell } from "@/components/data-display/data-table-shell";
import { StatusBadge } from "@/components/data-display/status-badge";
import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { ChevronRight } from "lucide-react";
import { formatDateTime } from "@/lib/utils/date";

export function OrganMatchList() {
  const { data: matchesRes, isLoading, error } = useOrganMatches();

  // Handle PaginatedResponse
  const matches = matchesRes?.items || [];
  const errorMessage = error instanceof Error ? error.message : typeof error === "string" ? error : undefined;

  return (
    <DataTableShell
      title="Compatibility Matches"
      description="System-generated compatibility assessments ranked by overall match score."
      isLoading={isLoading}
      error={errorMessage}
      isEmpty={!isLoading && matches.length === 0}
      emptyTitle="No matches found"
      emptyDescription="There are currently no active organ matches in the system."
    >
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="border-b border-border bg-slate-50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Rank</th>
              <th className="px-4 py-3 font-medium">Organ</th>
              <th className="px-4 py-3 font-medium">Compatibility</th>
              <th className="px-4 py-3 font-medium">Logistics</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Generated</th>
              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-white">
            {matches.map((match) => (
              <tr key={match.id} className="group hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 align-top">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-700">
                    {match.rank}
                  </div>
                </td>
                <td className="px-4 py-3 align-top">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-900 capitalize">{match.organType.toLowerCase()}</span>
                    <span className="text-xs text-muted-foreground">Match ID: {match.id.substring(0, 8)}</span>
                  </div>
                </td>
                <td className="px-4 py-3 align-top">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-700 font-medium">{match.overallCompatibilityScore} / 100</span>
                      {match.bloodGroupCompatible ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800">
                          Blood ✓
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-800">
                          Blood ✗
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">HLA: {match.hlaCompatibilityPercent}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 align-top">
                  <div className="flex flex-col">
                    <span className="text-slate-700">{match.distanceKm} km</span>
                    <span className="text-xs text-muted-foreground">Urgency Score: {match.urgencyScore}</span>
                  </div>
                </td>
                <td className="px-4 py-3 align-top">
                  <StatusBadge 
                    label={match.status}
                    tone={match.status === "PROPOSED" ? "warning" : match.status === "ACCEPTED" ? "success" : "neutral"} 
                  />
                </td>
                <td className="px-4 py-3 align-top">
                  <span className="text-slate-600">{formatDateTime(match.createdAt)}</span>
                </td>
                <td className="px-4 py-3 align-top text-right">
                  <Link
                    href={ROUTES.organ.matchDetail(match.id)}
                    className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label={`View details for match ${match.id}`}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DataTableShell>
  );
}
