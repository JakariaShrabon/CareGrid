import { DischargeSummaryView } from "@/features/billing/components/discharge-summary-view";
import { PageHeader } from "@/components/layout/page-container";

export default async function DischargeSummaryPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const resolvedParams = await params;
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Discharge Summary" 
        description="Review clinical summary, lab results, and medication." 
      />
      <DischargeSummaryView patientId={resolvedParams.patientId} />
    </div>
  );
}
