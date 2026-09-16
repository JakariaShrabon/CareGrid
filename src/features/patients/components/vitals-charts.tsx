"use client";

import { useMemo } from "react";
import type { VitalsRecord } from "@/contracts/patient";
import { EmptyState } from "@/components/feedback/empty-state";
import { formatDateTime } from "@/lib/utils/date";
import { HeartPulse } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export function VitalsCharts({ vitals }: { vitals: VitalsRecord[] }) {
  // Sort vitals chronologically for chart display
  const data = useMemo(() => {
    return [...vitals].sort(
      (a, b) => new Date(a.recordedAt).getTime() - new Date(b.recordedAt).getTime()
    ).map(v => ({
      ...v,
      formattedTime: formatDateTime(v.recordedAt).split(" ")[1] + " " + formatDateTime(v.recordedAt).split(" ")[2], // just time for x-axis
      fullTime: formatDateTime(v.recordedAt),
    }));
  }, [vitals]);

  if (vitals.length === 0) {
    return (
      <EmptyState
        icon={HeartPulse}
        title="No vitals recorded yet"
        description="Recorded temperature, blood pressure, and oxygen saturation trends will appear here."
      />
    );
  }

  return (
    <div className="space-y-8">
      {/* Temperature Chart */}
      <div className="rounded-lg border border-cyan-100/80 bg-gradient-to-br from-white via-cyan-50/50 to-emerald-50/40 p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-slate-900">Temperature (°C)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="formattedTime" textAnchor="end" tick={{ fontSize: 12, fill: "#64748b" }} />
              <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12, fill: "#64748b" }} />
              <Tooltip
                labelFormatter={(_label, payload) => payload?.[0]?.payload?.fullTime || ""}
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px" }}
              />

              <Line
                type="monotone"
                dataKey="temperatureCelsius"
                name="Temp"
                stroke="#0ea5e9"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Blood Pressure Chart */}
      <div className="rounded-lg border border-cyan-100/80 bg-gradient-to-br from-white via-sky-50/50 to-cyan-50/40 p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-slate-900">Blood Pressure (mmHg)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="formattedTime" textAnchor="end" tick={{ fontSize: 12, fill: "#64748b" }} />
              <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12, fill: "#64748b" }} />
              <Tooltip
                labelFormatter={(_label, payload) => payload?.[0]?.payload?.fullTime || ""}
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px" }}
              />

              <Line
                type="monotone"
                dataKey="systolicBp"
                name="Systolic"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="diastolicBp"
                name="Diastolic"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Oxygen Saturation Chart */}
      <div className="rounded-lg border border-cyan-100/80 bg-gradient-to-br from-white via-emerald-50/50 to-cyan-50/40 p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold text-slate-900">Oxygen Saturation (%)</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="formattedTime" textAnchor="end" tick={{ fontSize: 12, fill: "#64748b" }} />
              <YAxis domain={[80, 100]} tick={{ fontSize: 12, fill: "#64748b" }} />
              <Tooltip
                labelFormatter={(_label, payload) => payload?.[0]?.payload?.fullTime || ""}
                contentStyle={{ borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "13px" }}
              />

              <Line
                type="monotone"
                dataKey="oxygenSaturationPercent"
                name="SpO2"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
