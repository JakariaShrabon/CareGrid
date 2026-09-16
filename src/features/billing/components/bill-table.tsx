"use client";

import { useBills } from "../hooks/use-billing";
import { DataTableShell } from "@/components/data-display/data-table-shell";
import { StatusBadge } from "@/components/data-display/status-badge";
import { formatMoney } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";
import Link from "next/link";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BillTable() {
  const { data, isLoading } = useBills();
  const bills = data?.items || [];

  return (
    <DataTableShell
      title="Patient Bills"
      description="Manage hospital bills and monitor status."
      isLoading={isLoading}
      isEmpty={bills.length === 0}
      emptyDescription="No bills found in the system."
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
            <tr>
              <th className="px-4 py-3 font-medium">Bill ID</th>
              <th className="px-4 py-3 font-medium">Patient</th>
              <th className="px-4 py-3 font-medium">Generated At</th>
              <th className="px-4 py-3 font-medium text-right">Subtotal</th>
              <th className="px-4 py-3 font-medium text-right">Insurance Adj.</th>
              <th className="px-4 py-3 font-medium text-right">Patient Payable</th>
              <th className="px-4 py-3 font-medium text-center">Status</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {bills.map((bill) => (
              <tr key={bill.id} className="hover:bg-muted/50 transition-colors">
                <td className="px-4 py-3 font-medium">{bill.id}</td>
                <td className="px-4 py-3">{bill.patientId}</td>
                <td className="px-4 py-3">{formatDate(bill.generatedAt)}</td>
                <td className="px-4 py-3 text-right">{formatMoney(bill.subtotal)}</td>
                <td className="px-4 py-3 text-right text-emerald-600 dark:text-emerald-400">
                  {bill.insuranceAdjustment ? `-${formatMoney(bill.insuranceAdjustment)}` : "-"}
                </td>
                <td className="px-4 py-3 text-right font-semibold">{formatMoney(bill.patientPayable)}</td>
                <td className="px-4 py-3 text-center">
                  <StatusBadge status={
                      bill.status === "PAID" ? "APPROVED" : 
                      bill.status === "CANCELLED" ? "REJECTED" :
                      bill.status === "PARTIALLY_PAID" ? "WARNING" :
                      "PENDING"
                    } />
                </td>
                <td className="px-4 py-3 text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/billing/bills/${bill.id}`}>
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
