"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useBloodDonors } from "../hooks/use-blood-bank";
import { ShieldCheck, MapPin } from "lucide-react";
import { LoadingState } from "@/components/feedback/loading-state";
import { ErrorState } from "@/components/feedback/error-state";

import { DataTableShell } from "@/components/data-display/data-table-shell";

// Dynamically import the Leaflet map to prevent SSR issues with `window` object
const MapComponent = dynamic(() => import("./donor-map"), {
  ssr: false,
  loading: () => <LoadingState label="Loading map interface..." />
});

type GroupFilter = "ALL" | "O+" | "O-" | "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-";

export function DonorMapWrapper() {
  const { data, isLoading, error, refetch } = useBloodDonors();
  const [groupFilter, setGroupFilter] = useState<GroupFilter>("ALL");

  if (isLoading) return <LoadingState label="Loading geofence data..." />;

  if (error) {
    return (
      <ErrorState 
        title="Failed to load geofence" 
        description={error instanceof Error ? error.message : "Unknown error"} 
        action={<button onClick={() => refetch()} className="text-sm font-medium text-red-600 hover:text-red-500">Retry</button>} 
      />
    );
  }

  const donors = data?.items || [];
  const filteredDonors = groupFilter === "ALL" 
    ? donors 
    : donors.filter(d => d.bloodGroup === groupFilter);

  // We only show eligible donors on the map for emergency outreach
  const eligibleDonors = filteredDonors.filter(d => d.eligible);
  const mappableDonors = eligibleDonors.filter(d => d.latitude !== undefined && d.longitude !== undefined);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-cyan-100/80 bg-gradient-to-br from-white via-cyan-50/50 to-emerald-50/40 p-4 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h3 className="text-base font-semibold text-slate-900">Eligible Donor Geofence</h3>
          <p className="text-sm text-slate-500">{mappableDonors.length} eligible donors in immediate area</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-600 font-medium">Filter Group:</span>
          <select 
            className="text-sm rounded-md border border-slate-300 px-3 py-1.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value as GroupFilter)}
          >
            <option value="ALL">All Groups</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>
        </div>
      </div>

      <MapComponent donors={eligibleDonors} />

      {/* Fallback List View */}
      <DataTableShell
        title="Nearby Eligible Donors"
        description="Fallback list view for geospatial data. Ranked by proximity to hospital."
        isEmpty={mappableDonors.length === 0}
        emptyTitle="No nearby donors"
        emptyDescription="No eligible donors match the current geofence criteria."
      >
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="border-b border-cyan-100/80 bg-gradient-to-r from-white via-cyan-50/70 to-emerald-50/60 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Donor Reference</th>
                <th className="px-4 py-3 font-medium">Blood Group</th>
                <th className="px-4 py-3 font-medium">Distance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-white">
              {mappableDonors
                .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0))
                .slice(0, 10)
                .map((donor) => (
                <tr key={donor.id}>
                  <td className="px-4 py-3 align-top">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" aria-label="Privacy Protected" />
                      <span className="font-medium text-slate-900">{donor.displayName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top font-semibold text-rose-700">
                    {donor.bloodGroup}
                  </td>
                  <td className="px-4 py-3 align-top text-slate-600 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    {donor.distanceKm !== undefined ? `${donor.distanceKm} km` : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DataTableShell>
    </div>
  );
}
