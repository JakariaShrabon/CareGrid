"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { usePatients } from "../hooks/use-patients";
import { calculateAge, formatDateTime } from "@/lib/utils/date";
import { DataTableShell } from "@/components/data-display/data-table-shell";
import { StatusBadge } from "@/components/data-display/status-badge";
import { SearchInput } from "@/components/forms/search-input";
import { ROUTES } from "@/config/routes";


export function PatientList() {
  const [search, setSearch] = useState("");
  const { data, isLoading, error } = usePatients({ search });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const errorMessage = error instanceof Error ? error.message : typeof error === "string" ? error : undefined;

  return (
    <DataTableShell
      title="Patients"
      description="Manage patient records, clinical contexts, and admissions."
      toolbar={
        <SearchInput
          placeholder="Search patients..."
          value={search}
          onChange={handleSearch}
        />
      }
      isLoading={isLoading}
      error={errorMessage}
    >
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-slate-50 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">ID / Name</th>
              <th className="px-4 py-3 font-medium">Demographics</th>
              <th className="px-4 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-white">
            {data?.items?.map((patient) => {
              // Note: Using summary type properties if provided by the endpoint, otherwise fallback to patient properties
              const displayName = patient.displayName || `${patient.firstName} ${patient.lastName}`;
              const age = calculateAge(patient.dateOfBirth);
              
              return (
                <tr
                  key={patient.id}
                  className="group hover:bg-slate-50 transition-colors"
                >
                  <td className="px-4 py-3 align-top">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-900">{displayName}</span>
                      <span className="text-xs text-muted-foreground">{patient.patientNumber}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex flex-col">
                      <span className="text-slate-700">{age} • {patient.gender}</span>
                      <span className="text-xs text-muted-foreground">Blood: {patient.bloodGroup}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top">
                    <div className="flex flex-col gap-1 items-start">
                      {/* For now, just show a badge if status was available. We will assume some fields might not be populated in list view */}
                      <StatusBadge label="Admitted" tone="info" />
                      <span className="text-xs text-muted-foreground">Admitted: {formatDateTime(patient.createdAt)}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top text-right">
                    <Link
                      href={ROUTES.patients.detail(patient.id)}
                      className="inline-flex items-center justify-center rounded-md p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                      aria-label={`View patient ${displayName}`}
                    >
                      <ChevronRight className="h-5 w-5" />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </DataTableShell>
  );
}
