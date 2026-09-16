"use client";

import { useBloodSos } from "../hooks/use-blood-bank";
import { StatusBadge } from "@/components/data-display/status-badge";
import { formatDateTime, formatRelative } from "@/lib/utils/date";
import { formatComponentLabel } from "../utils/formatters";
import { Activity } from "lucide-react";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { LoadingState } from "@/components/feedback/loading-state";

export function SosList() {
  const { data, isLoading, error, refetch } = useBloodSos();

  const requests = data?.items || [];

  if (isLoading) {
    return <LoadingState label="Loading SOS requests..." />;
  }

  if (error) {
    return (
      <ErrorState 
        title="Failed to load SOS requests" 
        description={error instanceof Error ? error.message : "Unknown error"} 
        action={<button onClick={() => refetch()} className="text-sm font-medium text-red-600 hover:text-red-500">Retry</button>} 
      />
    );
  }

  if (requests.length === 0) {
    return (
      <EmptyState 
        icon={Activity} 
        title="No active SOS requests" 
        description="There are currently no active emergency blood shortage broadcasts in the network." 
      />
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((sos) => (
        <div key={sos.id} className="overflow-hidden rounded-xl border border-cyan-100/80 bg-gradient-to-br from-white via-rose-50/40 to-cyan-50/40 shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-cyan-100/80 bg-gradient-to-r from-white via-rose-50/60 to-cyan-50/60 px-5 py-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${sos.urgency === 'CRITICAL' ? 'bg-rose-100 text-rose-600' : 'bg-amber-100 text-amber-600'}`}>
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  Emergency Shortage
                  <StatusBadge 
                    label={sos.status}
                    tone={sos.status === "ACTIVE" ? "critical" : sos.status === "FULFILLED" ? "success" : "neutral"}
                  />
                </h3>
                <p className="text-sm text-slate-500">Requested {formatRelative(sos.createdAt)}</p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-slate-700">Required By</span>
              <span className="text-sm text-rose-600 font-semibold">{formatDateTime(sos.requiredBy)}</span>
            </div>
          </div>
          
          <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Requirement</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-rose-700">{sos.bloodGroup}</span>
                <span className="text-sm font-medium text-slate-700">{formatComponentLabel(sos.component)}</span>
              </div>
              <p className="mt-1 text-sm font-medium text-slate-900">{sos.requiredUnits} Units</p>
            </div>
            
            <div className="md:col-span-2">
              <span className="block text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Clinical Context</span>
              <p className="text-sm text-slate-700">{sos.reason}</p>
              
              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <span className="block text-xs text-slate-500 mb-0.5">Matched Eligible Donors</span>
                  <span className="text-sm font-semibold text-slate-900">{sos.matchedEligibleDonorCount} found in geofence</span>
                </div>
                {sos.deliverySummary && (
                  <div className="text-right">
                    <span className="block text-xs text-slate-500 mb-0.5">Broadcast Delivery</span>
                    <span className="text-sm font-medium text-slate-700">{sos.deliverySummary}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
