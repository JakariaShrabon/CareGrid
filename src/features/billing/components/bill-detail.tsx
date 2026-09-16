"use client";

import { useBill } from "../hooks/use-billing";
import { formatMoney } from "@/lib/utils/currency";
import { formatDate } from "@/lib/utils/date";
import { StatusBadge } from "@/components/data-display/status-badge";
import { BillItemsTable } from "./bill-items-table";
import { EmptyState } from "@/components/feedback/empty-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { ReceiptText } from "lucide-react";

export function BillDetail({ billId }: { billId: string }) {
  const { data: bill, isLoading } = useBill(billId);

  if (isLoading) return <LoadingState label="Loading bill details..." />;
  if (!bill) {
    return (
      <EmptyState
        icon={ReceiptText}
        title="Bill not found"
        description="This invoice may be unavailable or no longer assigned to the current view."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-cyan-100/80 bg-gradient-to-br from-white via-cyan-50/50 to-emerald-50/40 p-6 text-card-foreground shadow-sm">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Invoice {bill.id}</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Generated on {formatDate(bill.generatedAt)}
            </p>
          </div>
          <div className="text-right">
            <StatusBadge status={
                bill.status === "PAID" ? "APPROVED" : 
                bill.status === "CANCELLED" ? "REJECTED" :
                bill.status === "PARTIALLY_PAID" ? "WARNING" :
                "PENDING"
              } />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div>
            <p className="text-sm text-muted-foreground">Patient ID</p>
            <p className="font-medium">{bill.patientId}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Admission ID</p>
            <p className="font-medium">{bill.admissionId}</p>
          </div>
        </div>

        <BillItemsTable items={bill.items} />

        <div className="mt-8 border-t pt-6 flex flex-col items-end space-y-3">
          <div className="flex justify-between w-full md:w-64 text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">{formatMoney(bill.subtotal)}</span>
          </div>
          {bill.insuranceAdjustment && (
            <div className="flex justify-between w-full md:w-64 text-sm text-emerald-600 dark:text-emerald-400">
              <span>Insurance Adjustment</span>
              <span>-{formatMoney(bill.insuranceAdjustment)}</span>
            </div>
          )}
          <div className="flex justify-between w-full md:w-64 text-lg font-bold pt-3 border-t">
            <span>Patient Payable</span>
            <span>{formatMoney(bill.patientPayable)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
