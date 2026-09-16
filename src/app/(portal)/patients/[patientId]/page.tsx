"use client";

import { use, useState } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { LoadingState } from "@/components/feedback/loading-state";
import { ErrorState } from "@/components/feedback/error-state";
import { usePatient, usePatientAdmission, usePatientVitals, usePatientUpdates, usePatientLabResults } from "@/features/patients/hooks/use-patients";
import { PatientDetailHeader } from "@/features/patients/components/patient-detail-header";
import { PatientOverview } from "@/features/patients/components/patient-overview";
import { VitalsCharts } from "@/features/patients/components/vitals-charts";
import { RecordVitalsForm } from "@/features/patients/components/record-vitals-form";
import { DailyUpdatesTimeline } from "@/features/patients/components/daily-updates-timeline";
import { CreateUpdateForm } from "@/features/patients/components/create-update-form";
import { PatientLabResults } from "@/features/patients/components/patient-lab-results";
import { useAuth } from "@/features/auth/auth-provider";
import { hasPermission } from "@/lib/auth/rbac";

export default function PatientDetailPage({ params }: { params: Promise<{ patientId: string }> }) {
  const { patientId } = use(params);
  const { data: patientRes, isLoading: isLoadingPatient, error: errorPatient } = usePatient(patientId);
  const { data: admissionRes } = usePatientAdmission(patientId);
  const { data: vitalsRes, isLoading: isLoadingVitals } = usePatientVitals(patientId);
  const { data: updatesRes, isLoading: isLoadingUpdates } = usePatientUpdates(patientId);
  const { data: labsRes, isLoading: isLoadingLabs } = usePatientLabResults(patientId);
  
  const [activeTab, setActiveTab] = useState<"overview" | "vitals" | "updates" | "labs">("overview");
  
  // Modal states
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const { session } = useAuth();
  const canWriteVitals = session ? hasPermission(session.user.role, "patient.vitals.write") : false;
  const canWriteUpdate = session ? hasPermission(session.user.role, "patient.update.write") : false;

  if (isLoadingPatient) {
    return <PageContainer><div className="py-12"><LoadingState label="Loading patient details..." /></div></PageContainer>;
  }

  if (errorPatient || !patientRes) {
    return (
      <PageContainer>
        <div className="py-12">
          <ErrorState 
            title="Patient Not Found" 
            description="The patient you are looking for does not exist or you do not have permission to view them." 
          />
        </div>
      </PageContainer>
    );
  }

  const patient = patientRes;
  const admission = admissionRes;
  const vitals = vitalsRes || [];
  const updates = updatesRes || [];
  const labs = labsRes || [];

  return (
    <PageContainer>
      <PatientDetailHeader patient={patient} admission={admission} />

      <div className="mt-2">
        <div className="border-b border-border">
          <nav className="-mb-px flex space-x-6" aria-label="Tabs">
            {[
              { id: "overview", name: "Overview" },
              { id: "vitals", name: "Vitals" },
              { id: "updates", name: "Daily Updates" },
              { id: "labs", name: "Lab Results" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as "overview" | "vitals" | "updates" | "labs")}
                className={`
                  whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium
                  ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:border-slate-300 hover:text-slate-700"
                  }
                `}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="mt-6">
        {activeTab === "overview" && (
          <PatientOverview patient={patient} />
        )}

        {activeTab === "vitals" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-slate-900">Vitals History</h2>
            {canWriteVitals && (
              <button
                onClick={() => setShowVitalsModal(true)}
                className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Record Vitals
              </button>
            )}
            </div>
            {isLoadingVitals ? (
              <LoadingState label="Loading vitals..." />
            ) : (
              <VitalsCharts vitals={vitals} />
            )}
          </div>
        )}

        {activeTab === "updates" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-slate-900">Daily Updates</h2>
            {canWriteUpdate && (
              <button
                onClick={() => setShowUpdateModal(true)}
                className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                New Update
              </button>
            )}
            </div>
            {isLoadingUpdates ? (
              <LoadingState label="Loading updates..." />
            ) : (
              <DailyUpdatesTimeline updates={updates} />
            )}
          </div>
        )}

        {activeTab === "labs" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-slate-900">Lab Results</h2>
            </div>
            {isLoadingLabs ? (
              <LoadingState label="Loading lab results..." />
            ) : (
              <PatientLabResults results={labs} />
            )}
          </div>
        )}
      </div>

      {/* Overlays / Modals */}
      {showVitalsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-2xl bg-transparent">
            <RecordVitalsForm
              patient={patient}
              admissionId={admission?.id}
              onSuccess={() => setShowVitalsModal(false)}
              onCancel={() => setShowVitalsModal(false)}
            />
          </div>
        </div>
      )}

      {showUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <div className="w-full max-w-2xl bg-transparent">
            <CreateUpdateForm 
              patientId={patientId} 
              admissionId={admission?.id}
              onSuccess={() => setShowUpdateModal(false)}
              onCancel={() => setShowUpdateModal(false)}
            />
          </div>
        </div>
      )}
    </PageContainer>
  );
}
