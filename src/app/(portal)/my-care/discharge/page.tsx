"use client";

import { useAuth } from "@/features/auth/auth-provider";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-container";
import { ReadOnlyPortalTabs } from "@/features/patients/components/read-only-portal/portal-tabs";
import { DischargeSummaryView } from "@/features/billing/components/discharge-summary-view";
import { ErrorState } from "@/components/feedback/error-state";

export default function MyCareDischargePage() {
  const { session } = useAuth();
  const user = session?.user;

  if (!user?.patientId) {
    return (
      <PageContainer>
        <PageHeader title="My Care" />
        <ErrorState title="Access Denied" description="Your account is not linked to a patient profile." />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader title="My Care" />
      <ReadOnlyPortalTabs basePath="/my-care" />
      <div className="mt-6">
        <DischargeSummaryView patientId={user.patientId} />
      </div>
    </PageContainer>
  );
}
