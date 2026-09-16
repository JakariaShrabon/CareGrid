"use client";

import type { LabResult } from "@/contracts/patient";
import { EmptyState } from "@/components/feedback/empty-state";
import { formatDateTime } from "@/lib/utils/date";
import { FlaskConical } from "lucide-react";

export function PatientLabResults({ results }: { results: LabResult[] }) {
  if (results.length === 0) {
    return (
      <EmptyState
        icon={FlaskConical}
        title="No lab results available"
        description="Completed lab results and reference ranges will appear here when they are available."
      />
    );
  }

  // Sort newest first
  const sortedResults = [...results].sort(
    (a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime()
  );

  return (
    <div className="overflow-hidden rounded-lg border border-cyan-100/80 bg-gradient-to-br from-white via-cyan-50/40 to-emerald-50/40 shadow-sm">
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-cyan-100/80 bg-gradient-to-r from-white via-cyan-50/70 to-emerald-50/60 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Test Name</th>
              <th className="px-4 py-3 font-medium">Result</th>
              <th className="px-4 py-3 font-medium">Reference Range</th>
              <th className="px-4 py-3 font-medium">Performed At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-white">
            {sortedResults.map((result) => {
              const isAbnormal = result.flag && result.flag !== "NORMAL";
              
              return (
                <tr key={result.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900 align-top">
                    {result.testName}
                  </td>
                  <td className="px-4 py-3 align-top">
                    <span className={`font-medium ${isAbnormal ? (result.flag === "CRITICAL" ? "text-red-700" : "text-amber-700") : "text-slate-900"}`}>
                      {result.resultDisplay}
                    </span>
                    {result.flag && (
                      <span className={`ml-2 inline-flex items-center rounded-md px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                        result.flag === "NORMAL" ? "bg-emerald-50 text-emerald-700 ring-emerald-600/20" :
                        result.flag === "CRITICAL" ? "bg-red-50 text-red-700 ring-red-600/20" :
                        "bg-amber-50 text-amber-700 ring-amber-600/20"
                      }`}>
                        {result.flag}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-700 align-top">
                    {result.referenceRange || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-slate-700 align-top">
                    {formatDateTime(result.performedAt)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
