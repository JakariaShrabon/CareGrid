"use client";

import { BillItem } from "@/contracts/billing";
import { EmptyState } from "@/components/feedback/empty-state";
import { formatMoney } from "@/lib/utils/currency";
import { ReceiptText } from "lucide-react";

const categoryLabels: Record<string, string> = {
  ROOM: "Room",
  PHARMACY: "Pharmacy",
  SURGERY: "Surgery",
  CONSULTATION: "Doctor Consultation",
  OTHER: "Other",
};

export function BillItemsTable({ items }: { items: BillItem[] }) {
  if (!items || items.length === 0) {
    return (
      <EmptyState
        icon={ReceiptText}
        title="No itemized charges available"
        description="Room, pharmacy, consultation, and other invoice line items will appear here."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-cyan-100/80 bg-gradient-to-br from-white via-cyan-50/40 to-emerald-50/40 shadow-sm">
      <table className="w-full text-sm text-left">
        <thead className="bg-gradient-to-r from-white via-cyan-50/70 to-emerald-50/60 text-muted-foreground uppercase text-xs">
          <tr>
            <th className="px-4 py-3 font-medium">Description</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium text-right">Quantity</th>
            <th className="px-4 py-3 font-medium text-right">Unit Price</th>
            <th className="px-4 py-3 font-medium text-right">Total Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-muted/50 transition-colors">
              <td className="px-4 py-3 font-medium">{item.description}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {categoryLabels[item.category] || item.category}
              </td>
              <td className="px-4 py-3 text-right">{item.quantity}</td>
              <td className="px-4 py-3 text-right">{formatMoney(item.unitPrice)}</td>
              <td className="px-4 py-3 text-right font-medium">{formatMoney(item.totalPrice)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
