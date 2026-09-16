"use client";

import { use } from "react";
import { useOrganMatch } from "@/features/organ/hooks/use-organ";
import { PageContainer } from "@/components/layout/page-container";
import { LoadingState } from "@/components/feedback/loading-state";
import { ErrorState } from "@/components/feedback/error-state";
import { StatusBadge } from "@/components/data-display/status-badge";
import { MatchFactorBreakdown } from "@/features/organ/components/match-factor-breakdown";
import { formatDateTime } from "@/lib/utils/date";

export default function MatchDetailPage({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = use(params);
  const { data: matchRes, isLoading, error } = useOrganMatch(matchId);

  if (isLoading) {
    return <PageContainer><div className="py-12"><LoadingState label="Loading match details..." /></div></PageContainer>;
  }

  if (error || !matchRes) {
    return (
      <PageContainer>
        <div className="py-12">
          <ErrorState 
            title="Match Not Found" 
            description="The compatibility match could not be loaded or you do not have permission." 
          />
        </div>
      </PageContainer>
    );
  }

  const match = matchRes;

  return (
    <PageContainer>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 capitalize">
            {match.organType.toLowerCase()} Match Assessment
          </h1>
          <div className="mt-1 flex items-center gap-3 text-sm text-slate-600">
            <span>Match ID: {match.id}</span>
            <span>•</span>
            <span>Generated: {formatDateTime(match.createdAt)}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge 
            label={match.status} 
            tone={match.status === "PROPOSED" ? "warning" : match.status === "ACCEPTED" ? "success" : "neutral"} 
          />
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 font-semibold text-slate-700" title="Priority Rank">
            #{match.rank}
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Recipient Context */}
          <div className="flex flex-col overflow-hidden rounded-lg border border-cyan-100/80 bg-gradient-to-br from-white via-cyan-50/50 to-emerald-50/40 shadow-sm">
            <div className="border-b border-cyan-100/80 bg-gradient-to-r from-white via-cyan-50/70 to-emerald-50/60 px-5 py-4">
              <h3 className="font-semibold text-slate-900">Recipient Context</h3>
            </div>
            <div className="flex-1 p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Recipient ID</p>
                  <p className="mt-1 font-medium text-slate-900">{match.recipientId}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Organ Required</p>
                  <p className="mt-1 font-medium text-slate-900 capitalize">{match.organType.toLowerCase()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Donor Context */}
          <div className="flex flex-col overflow-hidden rounded-lg border border-cyan-100/80 bg-gradient-to-br from-white via-sky-50/50 to-cyan-50/40 shadow-sm">
            <div className="border-b border-cyan-100/80 bg-gradient-to-r from-white via-sky-50/70 to-cyan-50/60 px-5 py-4">
              <h3 className="font-semibold text-slate-900">Donor Context</h3>
            </div>
            <div className="flex-1 p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Donor Ref</p>
                  <p className="mt-1 font-medium text-slate-900">{match.donorId}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Organ Available</p>
                  <p className="mt-1 font-medium text-slate-900 capitalize">{match.organType.toLowerCase()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compatibility Breakdown */}
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Compatibility Assessment</h3>
          <MatchFactorBreakdown factors={match.factors} />
        </div>
      </div>
    </PageContainer>
  );
}
