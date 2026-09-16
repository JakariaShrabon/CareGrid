"use client";

import { useDischarges } from "../hooks/use-billing";
import { DataTableShell } from "@/components/data-display/data-table-shell";
import { StatusBadge } from "@/components/data-display/status-badge";
import { formatDate } from "@/lib/utils/date";
import Link from "next/link";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

export function DischargeTable() {
  const { data, isLoading } = useDischarges();
  const discharges = data?.items || [];

  return (
    <DataTableShell
      title="Discharges"
      description="Manage patient discharge summaries."
      isLoading={isLoading}
      isEmpty={discharges.length === 0}
      emptyDescription="No discharge records found."
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
            <tr>
              <th className="px-4 py-3 font-medium">Record ID</th>
              <th className="px-4 py-3 font-medium">Patient</th>
              <th className="px-4 py-3 font-medium">Admission</th>
              <th className="px-4 py-3 font-medium">Generated At</th>
              <th className="px-4 py-3 font-medium text-center">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {discharges.map((discharge) => (
              <tr key={discharge.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-4 py-3 font-medium">{discharge.id}</td>
                <td className="px-4 py-3">{discharge.patientId}</td>
                <td className="px-4 py-3 text-muted-foreground">{discharge.admissionId}</td>
                <td className="px-4 py-3">{formatDate(discharge.generatedAt)}</td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge status={discharge.status === "FINALIZED" ? "APPROVED" : "PENDING"} />
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/billing/discharge/${discharge.patientId}`}>
                      <FileText className="h-4 w-4 mr-1" />
                      View Summary
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
