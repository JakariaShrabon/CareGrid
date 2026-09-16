"use client";

import { useMemo, useState } from "react";
import { DataTableShell } from "@/components/data-display/data-table-shell";
import { StatusBadge } from "@/components/data-display/status-badge";
import { Input } from "@/components/ui/input";
import { usePharmacyInventory, useMedicines } from "../hooks/use-pharmacy";

export function PharmacyInventoryTable() {
  const { data: invData, isLoading: loadingInv } = usePharmacyInventory();
  const { data: medData, isLoading: loadingMed } = useMedicines();
  const [searchTerm, setSearchTerm] = useState("");

  const enrichedData = useMemo(() => {
    const safeInventory = (invData?.items as { medicineId: string, availableQuantity: number, lowStockThreshold: number, status: "SAFE" | "WARNING" | "CRITICAL" }[]) || [];
    const safeMedicines = (medData?.items as { id: string, genericName: string, strength: string, form: string, brandName?: string }[]) || [];

    return safeInventory.map((item) => {
      const med = safeMedicines.find((m) => m.id === item.medicineId);
      return {
        ...item,
        medicine: med,
      };
    }).filter((item) => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return (
        item.medicine?.genericName.toLowerCase().includes(search) ||
        item.medicine?.brandName?.toLowerCase().includes(search) ||
        item.medicine?.form.toLowerCase().includes(search)
      );
    });
  }, [invData?.items, medData?.items, searchTerm]);

  return (
    <DataTableShell
      isLoading={loadingInv || loadingMed}
      toolbar={
        <Input
          placeholder="Search medicines..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
      }
    >
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-slate-50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Medicine</th>
              <th className="px-4 py-3 font-medium">Strength / Form</th>
              <th className="px-4 py-3 font-medium">Available Quantity</th>
              <th className="px-4 py-3 font-medium">Threshold</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-white">
            {enrichedData.map((row, idx) => (
              <tr key={idx} className="group hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 align-top">
                  <div>
                    <div className="font-medium text-slate-900 dark:text-slate-100">
                      {row.medicine?.genericName || "Unknown"}
                    </div>
                    {row.medicine?.brandName && (
                      <div className="text-xs text-slate-500">
                        {row.medicine.brandName}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 align-top">
                  <div className="text-sm">
                    {row.medicine?.strength} • {row.medicine?.form}
                  </div>
                </td>
                <td className="px-4 py-3 align-top">
                  <div className="font-semibold text-slate-700 dark:text-slate-300">
                    {row.availableQuantity}
                  </div>
                </td>
                <td className="px-4 py-3 align-top">
                  <div className="text-sm text-slate-500">
                    {row.lowStockThreshold}
                  </div>
                </td>
                <td className="px-4 py-3 align-top">
                  <StatusBadge status={row.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DataTableShell>
  );
}
