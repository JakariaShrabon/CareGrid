"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { Pill, AlertTriangle, ShieldCheck, User } from "lucide-react";
import { PageContainer, PageHeader } from "@/components/layout/page-container";
import { StatusBadge } from "@/components/data-display/status-badge";
import { LoadingState } from "@/components/feedback/loading-state";
import { ErrorState } from "@/components/feedback/error-state";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/auth-provider";
import { hasPermission } from "@/lib/auth/rbac";
import { usePrescription } from "@/features/pharmacy/hooks/use-pharmacy";
import { usePatient } from "@/features/patients/hooks/use-patients";
import { DispenseConfirmation } from "@/features/pharmacy/components/dispense-confirmation";

export default function PrescriptionDetailPage() {
  const { id } = useParams() as { id: string };
  const { session } = useAuth();
  const user = session?.user;
  const [showDispense, setShowDispense] = useState(false);

  const { data: rxData, isLoading: loadingRx, error: rxError } = usePrescription(id);
  const prescription = rxData;

  const { data: patientData, isLoading: loadingPatient } = usePatient(prescription?.patientId || "");
  const patient = patientData;

  if (loadingRx || loadingPatient) {
    return <LoadingState label="Loading prescription details..." />;
  }

  if (rxError || !prescription) {
    return <ErrorState title="Not Found" description="The prescription could not be found." />;
  }

  const canDispense = user && hasPermission(user.role, "prescription.dispense") && prescription.status !== "DISPENSED" && prescription.status !== "CANCELLED";

  const isSafe = prescription.safetySummary?.status === "SAFE";

  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title={`Prescription ${prescription.id}`}
          description={`Created on ${format(new Date(prescription.createdAt), "MMM d, yyyy HH:mm")}`}
          eyebrow="Pharmacy"
          actions={
            canDispense ? (
              <Button onClick={() => setShowDispense(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white">
                <Pill className="mr-2 h-4 w-4" />
                Dispense Medications
              </Button>
            ) : null
          }
        />

        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Safety Summary Panel */}
            <div className={`rounded-xl border p-5 ${
              isSafe 
                ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/20" 
                : "border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20"
            }`}>
              <div className="flex items-start gap-3">
                {isSafe ? (
                  <ShieldCheck className="h-6 w-6 text-emerald-600 dark:text-emerald-400 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-500 mt-0.5" />
                )}
                <div>
                  <h3 className={`text-lg font-semibold ${isSafe ? "text-emerald-800 dark:text-emerald-300" : "text-amber-800 dark:text-amber-300"}`}>
                    {isSafe ? "Safety Check: Cleared" : "Safety Check: Warnings Identified"}
                  </h3>
                  
                  {isSafe ? (
                    <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
                      No configured allergy or interaction warnings were returned by the system.
                    </p>
                  ) : (
                    <div className="mt-3 space-y-2">
                      {prescription.safetySummary?.warnings.map((warning, idx) => (
                        <div key={idx} className="rounded-md bg-white/60 p-3 text-sm text-amber-900 dark:bg-slate-900/50 dark:text-amber-200">
                          <span className="font-semibold uppercase text-xs mr-2 px-1.5 py-0.5 rounded bg-amber-200 dark:bg-amber-800">
                            {warning.severity}
                          </span>
                          {warning.message}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Medications List */}
            <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
              <div className="border-b border-border bg-slate-50/50 p-4 dark:bg-slate-800/20">
                <h3 className="font-semibold text-card-foreground">Medications ({prescription.items.length})</h3>
              </div>
              <ul className="divide-y divide-border">
                {prescription.items.map((item) => (
                  <li key={item.id} className="p-4 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium text-slate-900 dark:text-slate-100">{item.medicineDisplay}</p>
                      <p className="text-sm text-slate-500 mt-0.5">
                        {item.dosage} • {item.frequency} • {item.duration}
                      </p>
                      {item.instructions && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded">
                          {item.instructions}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar Context */}
          <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h3 className="font-semibold text-card-foreground mb-4 flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Patient Context
              </h3>
              {patient ? (
                <div className="space-y-3 text-sm">
                  <div>
                    <div className="text-muted-foreground">Name</div>
                    <div className="font-medium text-slate-900 dark:text-slate-100">{patient.displayName}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Patient ID</div>
                    <div className="font-medium text-slate-900 dark:text-slate-100">{patient.patientNumber}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Known Allergies</div>
                    <div className="font-medium text-slate-900 dark:text-slate-100">
                      {patient.allergies?.length ? patient.allergies.join(", ") : "None recorded"}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-sm text-muted-foreground">Patient data unavailable.</div>
              )}
            </div>

            <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
              <h3 className="font-semibold text-card-foreground mb-4">Workflow Status</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Current State</div>
                  <StatusBadge 
                    status={prescription.status} 
                    tone={prescription.status === "DISPENSED" ? "success" : "info"} 
                  />
                </div>
                <div className="text-sm">
                  <div className="text-muted-foreground mb-1">Prescriber ID</div>
                  <div className="font-medium text-slate-900 dark:text-slate-100">{prescription.prescriberUserId}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <DispenseConfirmation
          open={showDispense}
          prescription={prescription}
          onCancel={() => setShowDispense(false)}
          onSuccess={() => setShowDispense(false)}
        />
      </div>
    </PageContainer>
  );
}
