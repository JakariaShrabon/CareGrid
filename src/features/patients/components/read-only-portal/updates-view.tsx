"use client";

import React from "react";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-container";
import { useAuth } from "@/features/auth/auth-provider";
import { ReadOnlyPortalTabs } from "@/features/patients/components/read-only-portal/portal-tabs";
import { usePatientUpdates } from "@/features/patients/hooks/use-patients";
import { DailyUpdatesTimeline } from "@/features/patients/components/daily-updates-timeline";
import { LoadingState } from "@/components/feedback/loading-state";
import { ErrorState } from "@/components/feedback/error-state";
import { MessageSquareText } from "lucide-react";
import { unwrapReadOnlyData } from "@/features/patients/utils/read-only-data";
import type { DailyPatientUpdate } from "@/contracts/patient";

export function ReadOnlyUpdatesView({ basePath, title }: { basePath: string, title: string }) {
  const { session } = useAuth();
  const user = session?.user;
  const patientId = user?.patientId;

  const { data: response, isLoading, error } = usePatientUpdates(patientId || "");

  if (!patientId) {
    return (
      <PageContainer>
        <PageHeader
          eyebrow="Read-only portal"
          title={title}
          description="Updates become available after this account is linked to a patient profile."
        />
        <ErrorState
          title="No linked patient profile"
          description="Your account is not linked to a patient profile."
        />
      </PageContainer>
    );
  }

  if (isLoading) {
    return (
      <PageContainer>
        <PageHeader
          eyebrow="Read-only portal"
          title={title}
          description="Loading family-visible care updates for the linked patient."
        />
        <ReadOnlyPortalTabs basePath={basePath} />
        <LoadingState label="Loading updates..." />
      </PageContainer>
    );
  }

  const visibleUpdates = unwrapReadOnlyData<DailyPatientUpdate[]>(
    response as DailyPatientUpdate[] | { data?: DailyPatientUpdate[] } | undefined,
  );

  if (error || !visibleUpdates) {
    return (
      <PageContainer>
        <PageHeader
          eyebrow="Read-only portal"
          title={title}
          description="We could not load the shared care updates for this account."
        />
        <ReadOnlyPortalTabs basePath={basePath} />
        <ErrorState title="Error" description="Could not load care updates." />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Read-only portal"
        title={title}
        description="Family-visible updates shared by the hospital care team."
      />
      <ReadOnlyPortalTabs basePath={basePath} />
      
      <div className="rounded-lg border border-cyan-100/80 bg-gradient-to-br from-white via-cyan-50/50 to-emerald-50/40 p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-3 border-b border-cyan-100/80 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-50 text-cyan-700">
            <MessageSquareText className="h-5 w-5" aria-hidden />
          </div>
          <div>
            <h2 className="text-base font-semibold text-slate-950">Care Updates</h2>
            <p className="text-sm text-muted-foreground">
              Read-only updates visible to this patient or family account.
            </p>
          </div>
        </div>
        <DailyUpdatesTimeline updates={visibleUpdates} />
      </div>
    </PageContainer>
  );
}
