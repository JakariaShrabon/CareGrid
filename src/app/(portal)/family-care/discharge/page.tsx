"use client";

import { useAuth } from "@/features/auth/auth-provider";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-container";
import { ReadOnlyPortalTabs } from "@/features/patients/components/read-only-portal/portal-tabs";
import { DischargeSummaryView } from "@/features/billing/components/discharge-summary-view";
import { FileText, LockKeyhole } from "lucide-react";

export default function FamilyCareDischargePage() {
  const { session } = useAuth();
  const user = session?.user;

  if (!user?.patientId) {
    return (
      <PageContainer>
        <PageHeader
          eyebrow="Family portal"
          title="Family Care Discharge"
          description="Discharge information becomes available after the hospital links your account to a patient profile."
        />
        <div className="rounded-lg border border-amber-200 bg-gradient-to-br from-white to-amber-50/60 p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <LockKeyhole className="h-5 w-5" aria-hidden />
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-slate-950">No linked patient profile</h2>
              <p className="max-w-2xl text-sm leading-6 text-amber-900">
                Your account is not linked to a patient profile. The hospital team
                controls patient linking and family access.
              </p>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Family portal"
        title="Family Care Discharge"
        description="Read-only discharge information shared with the linked family account."
      />
      <ReadOnlyPortalTabs basePath="/family-care" />
      <div className="rounded-lg border border-cyan-100/80 bg-gradient-to-br from-white via-cyan-50/50 to-emerald-50/40 p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-3 border-b border-cyan-100/80 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700">
            <FileText className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-950">Discharge information</h2>
            <p className="text-sm text-muted-foreground">
              Review hospital-provided discharge details when available.
            </p>
          </div>
        </div>
        <DischargeSummaryView patientId={user.patientId} />
      </div>
    </PageContainer>
  );
}
