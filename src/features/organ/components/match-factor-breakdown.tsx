import type { CompatibilityFactorBreakdown } from "@/contracts/organ";
import { cn } from "@/lib/utils/cn";

export function MatchFactorBreakdown({
  factors,
}: {
  factors: CompatibilityFactorBreakdown;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Blood Group */}
        <div className="rounded-lg border border-cyan-100/80 bg-gradient-to-br from-white via-cyan-50/50 to-emerald-50/40 p-4 shadow-sm">
          <h4 className="text-sm font-medium text-slate-500">Blood Group</h4>
          <div className="mt-2 flex items-baseline gap-2">
            <span
              className={cn(
                "text-2xl font-semibold",
                factors.bloodGroup.compatible ? "text-emerald-600" : "text-red-600"
              )}
            >
              {factors.bloodGroup.compatible ? "Compatible" : "Incompatible"}
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-600">Factor Score</span>
            <span className="font-medium">{factors.bloodGroup.score} / 100</span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100">
            <div
              className={cn(
                "h-1.5 rounded-full",
                factors.bloodGroup.compatible ? "bg-emerald-500" : "bg-red-500"
              )}
              style={{ width: `${factors.bloodGroup.score}%` }}
            />
          </div>
        </div>

        {/* HLA */}
        <div className="rounded-lg border border-cyan-100/80 bg-gradient-to-br from-white via-sky-50/50 to-cyan-50/40 p-4 shadow-sm">
          <h4 className="text-sm font-medium text-slate-500">HLA Compatibility</h4>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-slate-900">
              {factors.hla.score}%
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-600">Match Rate</span>
            <span className="font-medium">{factors.hla.score} / 100</span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100">
            <div
              className="h-1.5 rounded-full bg-sky-500"
              style={{ width: `${factors.hla.score}%` }}
            />
          </div>
        </div>

        {/* Urgency */}
        <div className="rounded-lg border border-cyan-100/80 bg-gradient-to-br from-white via-amber-50/50 to-cyan-50/40 p-4 shadow-sm">
          <h4 className="text-sm font-medium text-slate-500">Clinical Urgency</h4>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-slate-900">
              {factors.urgency.score}
            </span>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-600">Priority Score</span>
            <span className="font-medium">{factors.urgency.score} / 100</span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100">
            <div
              className="h-1.5 rounded-full bg-amber-500"
              style={{ width: `${factors.urgency.score}%` }}
            />
          </div>
        </div>

        {/* Distance */}
        <div className="rounded-lg border border-cyan-100/80 bg-gradient-to-br from-white via-indigo-50/40 to-cyan-50/40 p-4 shadow-sm">
          <h4 className="text-sm font-medium text-slate-500">Logistics & Distance</h4>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-semibold text-slate-900">
              {factors.distance.distanceKm}
            </span>
            <span className="text-sm text-slate-500">km</span>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-slate-600">Logistics Score</span>
            <span className="font-medium">{factors.distance.score} / 100</span>
          </div>
          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100">
            <div
              className="h-1.5 rounded-full bg-indigo-500"
              style={{ width: `${factors.distance.score}%` }}
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-cyan-100/80 bg-gradient-to-br from-white via-cyan-50/70 to-emerald-50/50 p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Overall Compatibility Score</h3>
            <p className="mt-1 text-sm text-slate-600">Aggregated clinical decision-support assessment</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-4xl font-bold text-primary">{factors.overallScore}</span>
            <span className="text-sm font-medium text-slate-500">out of 100</span>
          </div>
        </div>
        <div className="mt-6 h-3 w-full rounded-full bg-slate-200">
          <div
            className="h-3 rounded-full bg-primary transition-all"
            style={{ width: `${factors.overallScore}%` }}
          />
        </div>
      </div>
    </div>
  );
}
