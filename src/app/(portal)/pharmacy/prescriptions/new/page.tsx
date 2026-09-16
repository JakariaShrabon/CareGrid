"use client";

import { PageContainer, PageHeader } from "@/components/layout/page-container";
import { PrescriptionBuilder } from "@/features/pharmacy/components/prescription-builder";

export default function NewPrescriptionPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Digital Prescription"
          description="Create a new prescription, complete safety checks, and submit to the pharmacy queue."
          eyebrow="Pharmacy"
        />
        <PrescriptionBuilder />
      </div>
    </PageContainer>
  );
}
