"use client";

import { useState } from "react";
import { useInsuranceClaim, useUpdateInsuranceClaim } from "../hooks/use-billing";
import { StatusBadge } from "@/components/data-display/status-badge";
import { formatMoney } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/auth-provider";
import { hasPermission } from "@/lib/auth/rbac";
import { EmptyState } from "@/components/feedback/empty-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { FileCheck2 } from "lucide-react";

export function ClaimDetail({ claimId }: { claimId: string }) {
  const { data: claim, isLoading } = useInsuranceClaim(claimId);
  const updateClaim = useUpdateInsuranceClaim();
  const { session } = useAuth();
  const user = session?.user;
  
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  if (isLoading) return <LoadingState label="Loading claim details..." />;
  if (!claim) {
    return (
      <EmptyState
        icon={FileCheck2}
        title="Claim not found"
        description="This insurance claim may be unavailable or no longer assigned to the current view."
      />
    );
  }

  const handleApprove = () => {
    updateClaim.mutate(
      { 
        id: claim.id, 
        payload: { status: "APPROVED", decidedAt: new Date().toISOString() } 
      },
      {
        onSuccess: () => setIsApproving(false),
      }
    );
  };

  const handleReject = () => {
    updateClaim.mutate(
      { 
        id: claim.id, 
        payload: { 
          status: "REJECTED", 
          decidedAt: new Date().toISOString(),
          decisionMessage: rejectionReason 
        } 
      },
      {
        onSuccess: () => setIsRejecting(false),
      }
    );
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-cyan-100/80 bg-gradient-to-br from-white via-cyan-50/50 to-emerald-50/40 p-6 text-card-foreground shadow-sm">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Claim: {claim.claimNumber}</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Provider: {claim.providerName}
            </p>
          </div>
          <div className="text-right">
            <StatusBadge status={
                claim.status === "APPROVED" ? "APPROVED" : 
                claim.status === "REJECTED" ? "REJECTED" :
                "PENDING"
              } />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div>
            <p className="text-sm text-muted-foreground">Patient ID</p>
            <p className="font-medium">{claim.patientId}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Bill ID</p>
            <p className="font-medium">{claim.billId}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Submitted At</p>
            <p className="font-medium">{claim.submittedAt ? formatDate(claim.submittedAt) : "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Decided At</p>
            <p className="font-medium">{claim.decidedAt ? formatDate(claim.decidedAt) : "Pending"}</p>
          </div>
        </div>

        {claim.decisionMessage && (
          <div className="bg-amber-50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200 p-4 rounded-md mb-6 border border-amber-200 dark:border-amber-900/50">
            <h4 className="font-semibold text-sm mb-1">Decision Note</h4>
            <p className="text-sm">{claim.decisionMessage}</p>
          </div>
        )}

        {claim.approvedAmount && (
          <div className="flex justify-between w-full md:w-64 text-lg font-bold pt-3 border-t">
            <span>Approved Amount</span>
            <span className="text-emerald-600 dark:text-emerald-400">
              {formatMoney(claim.approvedAmount)}
            </span>
          </div>
        )}

        {/* Mutation Actions */}
        {user && hasPermission(user.role, "insurance.manage") && (claim.status === "PENDING" || claim.status === "SUBMITTED" || claim.status === "UNDER_REVIEW") && (
            <div className="mt-8 pt-6 border-t flex flex-wrap gap-4">
              {!isApproving && !isRejecting && (
                <>
                  <Button onClick={() => setIsApproving(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    Approve Claim
                  </Button>
                  <Button onClick={() => setIsRejecting(true)} variant="destructive">
                    Reject Claim
                  </Button>
                </>
              )}

              {isApproving && (
                <div className="w-full flex items-center gap-3 bg-muted p-4 rounded-md">
                  <p className="text-sm flex-1">Confirm approval of this claim?</p>
                  <Button variant="ghost" size="sm" onClick={() => setIsApproving(false)} disabled={updateClaim.isPending}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleApprove} disabled={updateClaim.isPending} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    {updateClaim.isPending ? "Approving..." : "Confirm Approval"}
                  </Button>
                </div>
              )}

              {isRejecting && (
                <div className="w-full space-y-3 bg-muted p-4 rounded-md">
                  <label htmlFor="reason" className="block text-sm font-medium">Rejection Reason</label>
                  <textarea
                    id="reason"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    rows={3}
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Enter reason for rejection..."
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setIsRejecting(false)} disabled={updateClaim.isPending}>
                      Cancel
                    </Button>
                    <Button size="sm" variant="destructive" onClick={handleReject} disabled={updateClaim.isPending}>
                      {updateClaim.isPending ? "Rejecting..." : "Confirm Rejection"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
        )}
      </div>
    </div>
  );
}
