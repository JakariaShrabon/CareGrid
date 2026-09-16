"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { DataTableShell } from "@/components/data-display/data-table-shell";
import { StatusBadge } from "@/components/data-display/status-badge";
import { Input } from "@/components/ui/input";
import { usePrescriptions } from "../hooks/use-pharmacy";
import { usePatients } from "@/features/patients/hooks/use-patients";

export function PrescriptionQueueTable() {
  const { data: prescriptionsData, isLoading: loadingRx } = usePrescriptions();
  const { data: patientsData, isLoading: loadingPatients } = usePatients();
  const [searchTerm, setSearchTerm] = useState("");

  const enrichedData = useMemo(() => {
    const prescriptions = (prescriptionsData?.items as { id: string, patientId: string, prescriberUserId: string, status: "PENDING" | "READY" | "DISPENSED" | "CANCELLED" | "DRAFT" | "REVIEWED", createdAt: string, items: Array<{ medicineDisplay: string }>, safetySummary?: { status: "SAFE" | "WARNING" | "CRITICAL" | "PENDING" | "DRAFT" | "REVIEWED" | "DISPENSED" | "CANCELLED" | "READY" } }[]) || [];
    const patients = (patientsData?.items as { id: string, displayName: string, patientNumber: string }[]) || [];

    return prescriptions.map((rx) => {
      const patient = patients.find((p) => p.id === rx.patientId);
      return {
        ...rx,
        patient,
      };
    }).filter((rx) => {
      if (!searchTerm) return true;
      const search = searchTerm.toLowerCase();
      return (
        rx.id.toLowerCase().includes(search) ||
        rx.patient?.displayName?.toLowerCase().includes(search) ||
        rx.patient?.patientNumber?.toLowerCase().includes(search) ||
        rx.status.toLowerCase().includes(search)
      );
    });
  }, [prescriptionsData?.items, patientsData?.items, searchTerm]);

  return (
    <DataTableShell
      isLoading={loadingRx || loadingPatients}
      toolbar={
        <Input
          placeholder="Search by ID or Patient..."
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
              <th className="px-4 py-3 font-medium">Prescription ID</th>
              <th className="px-4 py-3 font-medium">Patient</th>
              <th className="px-4 py-3 font-medium">Created At</th>
              <th className="px-4 py-3 font-medium">Items</th>
              <th className="px-4 py-3 font-medium">Safety Status</th>
              <th className="px-4 py-3 font-medium">Workflow</th>
              <th className="px-4 py-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-white">
            {enrichedData.map((row) => (
              <tr key={row.id} className="group hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 align-top">
                  <Link href={`/pharmacy/prescriptions/${row.id}`} className="font-medium text-sky-600 hover:underline">
                    {row.id}
                  </Link>
                </td>
                <td className="px-4 py-3 align-top">
                  <div>
                    <div className="font-medium text-slate-900 dark:text-slate-100">
                      {row.patient?.displayName || "Unknown Patient"}
                    </div>
                    <div className="text-xs text-slate-500">
                      {row.patient?.patientNumber}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 align-top">
                  <div className="text-sm text-slate-700">
                    {format(new Date(row.createdAt), "MMM d, yyyy HH:mm")}
                  </div>
                </td>
                <td className="px-4 py-3 align-top">
                  <div className="text-sm text-slate-600">
                    {row.items.length} {row.items.length === 1 ? 'med' : 'meds'}
                  </div>
                </td>
                <td className="px-4 py-3 align-top">
                  <StatusBadge status={row.safetySummary?.status || "PENDING"} />
                </td>
                <td className="px-4 py-3 align-top">
                  <StatusBadge status={row.status} />
                </td>
                <td className="px-4 py-3 align-top text-right">
                  <Link 
                    href={`/pharmacy/prescriptions/${row.id}`}
                    className="text-sm font-medium text-sky-600 hover:text-sky-700"
                  >
                    View Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DataTableShell>
  );
}
