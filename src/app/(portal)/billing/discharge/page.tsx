import { DischargeTable } from "@/features/billing/components/discharge-table";
import { PageHeader } from "@/components/layout/page-container";

export default function DischargePage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Discharges" 
        description="Monitor and access patient discharge summaries." 
      />
      <DischargeTable />
    </div>
  );
}
