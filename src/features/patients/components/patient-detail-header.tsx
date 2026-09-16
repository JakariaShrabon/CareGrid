import type { Patient, PatientAdmission } from "@/contracts/patient";
import { calculateAge } from "@/lib/utils/date";
import { StatusBadge } from "@/components/data-display/status-badge";
import { Droplet, User, Hash } from "lucide-react";

export function PatientDetailHeader({
  patient,
  admission,
}: {
  patient: Patient;
  admission?: PatientAdmission;
}) {
  const age = calculateAge(patient.dateOfBirth);

  return (
    <div className="flex flex-col gap-6 rounded-lg border border-cyan-100/80 bg-gradient-to-br from-white via-cyan-50/50 to-emerald-50/40 p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-950">{patient.displayName}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Hash className="h-4 w-4" />
              {patient.patientNumber}
            </span>
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              {age} • {patient.gender}
            </span>
            <span className="flex items-center gap-1.5">
              <Droplet className="h-4 w-4" />
              Blood: {patient.bloodGroup}
            </span>
          </div>
        </div>
        {admission ? (
          <div className="flex shrink-0 flex-col items-end gap-2">
            <StatusBadge
              label={admission.status}
              tone={admission.status === "ADMITTED" ? "info" : admission.status === "DISCHARGED" ? "success" : "warning"}
            />
          </div>
        ) : (
          <div className="flex shrink-0 flex-col items-end gap-2">
            <StatusBadge label="Not Admitted" tone="neutral" />
          </div>
        )}
      </div>

      {admission && (
        <div className="grid grid-cols-2 gap-4 rounded-md border border-cyan-100/80 bg-white/70 p-4 text-sm sm:grid-cols-4">
          <div>
            <p className="text-muted-foreground mb-1">Ward</p>
            <p className="font-medium text-slate-900">{admission.wardId}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Room</p>
            <p className="font-medium text-slate-900">{admission.roomId}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Bed</p>
            <p className="font-medium text-slate-900">{admission.bedId}</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Primary Doctor</p>
            <p className="font-medium text-slate-900">{admission.primaryDoctorId}</p>
          </div>
        </div>
      )}
    </div>
  );
}
