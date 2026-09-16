"use client";

import { useInsuranceClaims } from "../hooks/use-billing";
import { DataTableShell } from "@/components/data-display/data-table-shell";
import { StatusBadge } from "@/components/data-display/status-badge";
import { formatMoney } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";
import Link from "next/link";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ClaimTable() {
  const { data, isLoading } = useInsuranceClaims();
  const claims = data?.items || [];

  return (
    <DataTableShell
      title="Insurance Claims"
      description="Track the status of patient insurance claims."
      isLoading={isLoading}
      isEmpty={claims.length === 0}
      emptyDescription="No insurance claims found."
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
            <tr>
              <th className="px-4 py-3 font-medium">Claim ID</th>
              <th className="px-4 py-3 font-medium">Patient</th>
              <th className="px-4 py-3 font-medium">Provider</th>
              <th className="px-4 py-3 font-medium">Submitted</th>
              <th className="px-4 py-3 font-medium text-right">Approved Amt</th>
              <th className="px-4 py-3 font-medium text-center">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {claims.map((claim) => (
              <tr key={claim.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-4 py-3 font-medium">
                  {claim.claimNumber}
                  <span className="block text-xs text-muted-foreground font-normal">{claim.id}</span>
                </td>
                <td className="px-4 py-3">{claim.patientId}</td>
                <td className="px-4 py-3">{claim.providerName}</td>
                <td className="px-4 py-3">{claim.submittedAt ? formatDate(claim.submittedAt) : "-"}</td>
                <td className="px-4 py-3 text-right">
                  {claim.approvedAmount ? formatMoney(claim.approvedAmount) : "-"}
                </td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge status={
                      claim.status === "APPROVED" ? "APPROVED" : 
                      claim.status === "REJECTED" ? "REJECTED" :
                      "PENDING"
                    } />
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/billing/claims/${claim.id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DataTableShell>
  );
}
