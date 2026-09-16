"use client";

import { useBloodInventory } from "../hooks/use-blood-bank";
import { DataTableShell } from "@/components/data-display/data-table-shell";
import { StatusBadge } from "@/components/data-display/status-badge";
import { formatComponentLabel } from "../utils/formatters";

export function InventoryTable() {
  const { data, isLoading, error } = useBloodInventory();

  const inventory = data || [];
  const errorMessage = error instanceof Error ? error.message : typeof error === "string" ? error : undefined;

  return (
    <DataTableShell
      title="Component Inventory Matrix"
      description="Aggregated view of available blood components by group. Stock thresholds are managed centrally."
      isLoading={isLoading}
      error={errorMessage}
      isEmpty={!isLoading && inventory.length === 0}
      emptyTitle="No inventory data"
      emptyDescription="The inventory system returned no component summaries."
    >
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="border-b border-border bg-slate-50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Blood Group</th>
              <th className="px-4 py-3 font-medium">Component</th>
              <th className="px-4 py-3 font-medium text-right">Available</th>
              <th className="px-4 py-3 font-medium text-right">Reserved</th>
              <th className="px-4 py-3 font-medium text-right">Expiring Soon</th>
              <th className="px-4 py-3 font-medium text-right">Safe Threshold</th>
              <th className="px-4 py-3 font-medium">Stock Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-white">
            {inventory.map((row, idx) => (
              <tr key={`${row.bloodGroup}-${row.component}-${idx}`} className="group hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 align-top font-semibold text-rose-700">
                  {row.bloodGroup}
                </td>
                <td className="px-4 py-3 align-top font-medium text-slate-900">
                  {formatComponentLabel(row.component)}
                </td>
                <td className="px-4 py-3 align-top text-right text-slate-900 font-medium">
                  {row.availableUnits}
                </td>
                <td className="px-4 py-3 align-top text-right text-slate-600">
                  {row.reservedUnits > 0 ? row.reservedUnits : "-"}
                </td>
                <td className="px-4 py-3 align-top text-right text-amber-600 font-medium">
                  {row.expiringSoonUnits > 0 ? row.expiringSoonUnits : "-"}
                </td>
                <td className="px-4 py-3 align-top text-right text-slate-500">
                  {row.safeThreshold}
                </td>
                <td className="px-4 py-3 align-top">
                  <StatusBadge 
                    label={row.status === "SAFE" ? "Safe" : row.status === "WARNING" ? "Low Stock" : "Critical"}
                    tone={row.status === "SAFE" ? "success" : row.status === "WARNING" ? "warning" : "critical"}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DataTableShell>
  );
}
