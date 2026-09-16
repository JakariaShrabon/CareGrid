"use client";

import { useState, useMemo } from "react";
import { useBloodUnits } from "../hooks/use-blood-bank";
import { DataTableShell } from "@/components/data-display/data-table-shell";
import { StatusBadge } from "@/components/data-display/status-badge";
import { formatDateTime, formatRelative } from "@/lib/utils/date";
import { formatComponentLabel } from "../utils/formatters";
import { isToday, isBefore, addDays, parseISO } from "date-fns";

type ExpiryFilter = "ALL" | "EXPIRED" | "TODAY" | "NEXT_3" | "NEXT_7";
type GroupFilter = "ALL" | "O+" | "O-" | "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-";

export function BloodUnitTable() {
  const { data, isLoading, error } = useBloodUnits();
  
  const [expiryFilter, setExpiryFilter] = useState<ExpiryFilter>("ALL");
  const [groupFilter, setGroupFilter] = useState<GroupFilter>("ALL");

  const errorMessage = error instanceof Error ? error.message : typeof error === "string" ? error : undefined;

  const filteredUnits = useMemo(() => {
    const units = data?.items || [];
    return units.filter(unit => {
      // Blood Group filter
      if (groupFilter !== "ALL" && unit.bloodGroup !== groupFilter) return false;

      // Expiry Filter
      if (expiryFilter !== "ALL") {
        const expiryDate = parseISO(unit.expiresAt);
        const now = new Date();
        
        switch (expiryFilter) {
          case "EXPIRED":
            if (unit.status !== "EXPIRED" && isBefore(now, expiryDate)) return false;
            break;
          case "TODAY":
            if (!isToday(expiryDate)) return false;
            break;
          case "NEXT_3":
            if (isBefore(expiryDate, now) || isBefore(addDays(now, 3), expiryDate)) return false;
            break;
          case "NEXT_7":
            if (isBefore(expiryDate, now) || isBefore(addDays(now, 7), expiryDate)) return false;
            break;
        }
      }

      return true;
    });
  }, [data?.items, expiryFilter, groupFilter]);

  return (
    <DataTableShell
      title="Blood Units Tracker"
      description="Detailed tracking of individual blood units and components across the inventory."
      isLoading={isLoading}
      error={errorMessage}
      isEmpty={!isLoading && filteredUnits.length === 0}
      emptyTitle="No units found"
      emptyDescription="No blood units match the current filter criteria."
      toolbar={
        <div className="flex gap-2 items-center flex-wrap">
          <select 
            className="text-sm rounded-md border border-slate-300 px-3 py-1.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value as GroupFilter)}
          >
            <option value="ALL">All Groups</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
          </select>

          <select
            className="text-sm rounded-md border border-slate-300 px-3 py-1.5 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            value={expiryFilter}
            onChange={(e) => setExpiryFilter(e.target.value as ExpiryFilter)}
          >
            <option value="ALL">All Time</option>
            <option value="EXPIRED">Expired</option>
            <option value="TODAY">Expires Today</option>
            <option value="NEXT_3">Expires in 3 Days</option>
            <option value="NEXT_7">Expires in 7 Days</option>
          </select>
        </div>
      }
    >
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="border-b border-border bg-slate-50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Unit ID</th>
              <th className="px-4 py-3 font-medium">Group</th>
              <th className="px-4 py-3 font-medium">Component</th>
              <th className="px-4 py-3 font-medium">Collected At</th>
              <th className="px-4 py-3 font-medium">Expires At</th>
              <th className="px-4 py-3 font-medium">Remaining</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-white">
            {filteredUnits.map((unit) => (
              <tr key={unit.id} className="group hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 align-top font-mono text-xs text-slate-500">
                  {unit.id.substring(0, 8)}...
                </td>
                <td className="px-4 py-3 align-top font-semibold text-rose-700">
                  {unit.bloodGroup}
                </td>
                <td className="px-4 py-3 align-top text-slate-900">
                  {formatComponentLabel(unit.component)}
                </td>
                <td className="px-4 py-3 align-top text-slate-600">
                  {formatDateTime(unit.collectedAt)}
                </td>
                <td className="px-4 py-3 align-top text-slate-900 font-medium">
                  {formatDateTime(unit.expiresAt)}
                </td>
                <td className="px-4 py-3 align-top text-slate-500">
                  {unit.status === "EXPIRED" ? "-" : formatRelative(unit.expiresAt)}
                </td>
                <td className="px-4 py-3 align-top">
                  <StatusBadge 
                    label={unit.status}
                    tone={
                      unit.status === "AVAILABLE" ? "success" :
                      unit.status === "RESERVED" ? "warning" :
                      unit.status === "EXPIRED" ? "critical" : "neutral"
                    }
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
