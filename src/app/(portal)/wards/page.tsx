"use client";

import { useState, useEffect, useMemo } from "react";
import { useWards, useWardBeds, useUpdateBedStatus } from "@/features/wards/hooks/use-wards";
import { useAuth } from "@/features/auth/auth-provider";
import { hasPermission } from "@/lib/auth/rbac";
import { PageContainer, PageHeader } from "@/components/layout/page-container";
import { LoadingState } from "@/components/feedback/loading-state";
import { ErrorState } from "@/components/feedback/error-state";
import { EmptyState } from "@/components/feedback/empty-state";
import { StatusBadge } from "@/components/data-display/status-badge";
import { Bed as BedIcon, User } from "lucide-react";
import type { Ward, BedStatus, Bed } from "@/contracts/ward";
import type { PaginatedResponse } from "@/contracts/common";
import { formatRelative } from "@/lib/utils/date";

export default function WardsPage() {
  const { data: wardsRes, isLoading: isLoadingWards, error: errorWards } = useWards();
  // apiClient unwraps the outer ApiResponse envelope; the hook returns PaginatedResponse<Ward>
  const wards: Ward[] = useMemo(
    () => (wardsRes as PaginatedResponse<Ward> | undefined)?.items ?? [],
    [wardsRes]
  );

  const [selectedWardId, setSelectedWardId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedWardId && wards.length > 0) {
      setSelectedWardId(wards[0].id);
    }
  }, [wards, selectedWardId]);

  const { data: bedsRes, isLoading: isLoadingBeds } = useWardBeds(selectedWardId ?? "");
  // apiClient returns Bed[] directly
  const beds: Bed[] = useMemo(
    () => (bedsRes as Bed[] | undefined) ?? [],
    [bedsRes]
  );

  const { mutate: updateBed, isPending: isUpdatingBed } = useUpdateBedStatus();

  const { session } = useAuth();
  const canManageWard = session ? hasPermission(session.user.role, "ward.manage") : false;

  const handleStatusChange = (bedId: string, newStatus: BedStatus) => {
    updateBed({ id: bedId, status: newStatus });
  };

  if (isLoadingWards) {
    return (
      <PageContainer>
        <div className="py-12">
          <LoadingState label="Loading wards..." />
        </div>
      </PageContainer>
    );
  }

  if (errorWards) {
    return (
      <PageContainer>
        <div className="py-12">
          <ErrorState title="Failed to load wards" description="There was an issue loading the ward data." />
        </div>
      </PageContainer>
    );
  }

  const available = beds.filter((b) => b.status === "AVAILABLE").length;
  const occupied  = beds.filter((b) => b.status === "OCCUPIED").length;
  const cleaning  = beds.filter((b) => b.status === "CLEANING").length;
  const reserved  = beds.filter((b) => b.status === "RESERVED").length;

  const bedsByRoom = beds.reduce<Record<string, Bed[]>>((acc, bed) => {
    (acc[bed.roomId] ??= []).push(bed);
    return acc;
  }, {});

  return (
    <PageContainer>
      <PageHeader
        title="Ward & Bed Management"
        description="Monitor hospital bed availability and manage cleaning operations."
      />

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Ward Selector */}
        <div className="w-full shrink-0 overflow-hidden rounded-lg border border-cyan-100/80 bg-gradient-to-br from-white via-cyan-50/50 to-emerald-50/40 shadow-sm lg:w-64">
          <div className="border-b border-cyan-100/80 bg-gradient-to-r from-white via-cyan-50/70 to-emerald-50/60 px-4 py-3">
            <h3 className="text-sm font-semibold text-slate-900">Hospital Wards</h3>
          </div>
          <nav aria-label="Ward list" className="flex flex-col">
            {wards.map((ward) => (
              <button
                key={ward.id}
                onClick={() => setSelectedWardId(ward.id)}
                aria-pressed={selectedWardId === ward.id}
                className={`flex items-center px-4 py-3 text-sm font-medium border-l-4 text-left transition-colors ${
                  selectedWardId === ward.id
                    ? "border-primary bg-sky-50 text-primary"
                    : "border-transparent text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex flex-col items-start">
                  <span>{ward.name}</span>
                  <span className="text-xs font-normal text-muted-foreground">Floor {ward.floor ?? "N/A"}</span>
                </div>
              </button>
            ))}
          </nav>
        </div>

        {/* Ward Detail */}
        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Available", count: available, color: "text-emerald-600" },
              { label: "Occupied",  count: occupied,  color: "text-sky-600" },
              { label: "Cleaning",  count: cleaning,  color: "text-amber-600" },
              { label: "Reserved",  count: reserved,  color: "text-slate-600" },
            ].map(({ label, count, color }) => (
              <div key={label} className="flex flex-col rounded-lg border border-cyan-100/80 bg-gradient-to-br from-white via-cyan-50/50 to-emerald-50/40 p-4 shadow-sm">
                <span className="text-sm text-muted-foreground">{label}</span>
                <span className={`mt-1 text-2xl font-semibold ${color}`}>{count}</span>
              </div>
            ))}
          </div>

          {isLoadingBeds ? (
            <div className="rounded-lg border border-cyan-100/80 bg-gradient-to-br from-white via-cyan-50/50 to-emerald-50/40 p-4 shadow-sm">
              <LoadingState label="Loading beds..." />
            </div>
          ) : beds.length === 0 ? (
            <EmptyState
              icon={BedIcon}
              title="No beds configured"
              description="Beds assigned to the selected ward will appear here once the ward layout is available."
            />
          ) : (
            <div className="space-y-8">
              {Object.entries(bedsByRoom).map(([roomId, roomBeds]) => (
                <div key={roomId} className="overflow-hidden rounded-lg border border-cyan-100/80 bg-gradient-to-br from-white via-cyan-50/40 to-emerald-50/30 shadow-sm">
                  <div className="flex items-center justify-between border-b border-cyan-100/80 bg-gradient-to-r from-white via-cyan-50/70 to-emerald-50/60 px-4 py-3">
                    <h3 className="text-sm font-semibold text-slate-900">Room {roomId}</h3>
                    <span className="text-xs text-muted-foreground">{roomBeds.length} beds</span>
                  </div>

                  <div className="p-4 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
                    {roomBeds.map((bed) => (
                      <div
                        key={bed.id}
                        className={`flex flex-col rounded-lg border p-4 transition-shadow hover:shadow-md ${
                          bed.status === "AVAILABLE" ? "border-emerald-200 bg-emerald-50/50" :
                          bed.status === "OCCUPIED"  ? "border-sky-200 bg-sky-50/50" :
                          bed.status === "CLEANING"  ? "border-amber-200 bg-amber-50/50" :
                                                       "border-slate-200 bg-slate-50/50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="font-semibold text-slate-900 text-lg">{bed.label}</span>
                          <StatusBadge status={bed.status} />
                        </div>

                        <div className="mt-auto space-y-3">
                          {bed.status === "OCCUPIED" && bed.currentAdmissionId ? (
                            <div className="flex items-center text-sm text-slate-700 bg-white/60 p-2 rounded border border-white">
                              <User className="mr-2 h-4 w-4 text-slate-400" aria-hidden />
                              <span className="truncate">Patient details</span>
                            </div>
                          ) : (
                            <div className="h-9" aria-hidden />
                          )}

                          <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-black/5 pt-3">
                            <time dateTime={bed.updatedAt} title={bed.updatedAt}>
                              {formatRelative(bed.updatedAt)}
                            </time>

                            {canManageWard ? (
                              <select
                                aria-label={`Change status for ${bed.label}`}
                                className="text-xs bg-white border border-slate-300 rounded px-1.5 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                                value={bed.status}
                                disabled={isUpdatingBed}
                                onChange={(e) => handleStatusChange(bed.id, e.target.value as BedStatus)}
                              >
                                <option value="AVAILABLE">Available</option>
                                <option value="OCCUPIED" disabled>Occupied</option>
                                <option value="CLEANING">Cleaning</option>
                                <option value="RESERVED">Reserved</option>
                              </select>
                            ) : (
                              <span className="text-slate-400 italic text-xs">Read-only</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
