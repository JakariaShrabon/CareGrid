import { BillTable } from "@/features/billing/components/bill-table";
import { PageHeader } from "@/components/layout/page-container";

export default function BillsPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Patient Bills" 
        description="View and manage itemized bills for patients." 
      />
      <BillTable />
    </div>
  );
}
