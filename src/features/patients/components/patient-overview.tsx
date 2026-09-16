import type { Patient } from "@/contracts/patient";
import { formatDateTime } from "@/lib/utils/date";

export function PatientOverview({
  patient,
}: {
  patient: Patient;
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-cyan-100/80 bg-gradient-to-br from-white via-cyan-50/50 to-emerald-50/40 p-5 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-slate-950">Patient Information</h2>
          <dl className="grid grid-cols-1 gap-y-4 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">ID</dt>
              <dd className="mt-1 text-sm text-slate-900">{patient.patientNumber}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Name</dt>
              <dd className="mt-1 text-sm text-slate-900">{patient.displayName}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Date of Birth</dt>
              <dd className="mt-1 text-sm text-slate-900">{formatDateTime(patient.dateOfBirth).split(" ")[0]}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">Registered At</dt>
              <dd className="mt-1 text-sm text-slate-900">{formatDateTime(patient.createdAt)}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border border-cyan-100/80 bg-gradient-to-br from-white via-rose-50/50 to-cyan-50/40 p-5 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-slate-950">Known Allergies</h2>
          {patient.allergies && patient.allergies.length > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {patient.allergies.map((allergy) => (
                <li
                  key={allergy}
                  className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10"
                >
                  {allergy}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No known allergies recorded.</p>
          )}
        </div>
      </div>
    </div>
  );
}
