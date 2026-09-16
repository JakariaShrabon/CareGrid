import { ClaimTable } from "@/features/billing/components/claim-table";
import { PageHeader } from "@/components/layout/page-container";

export default function ClaimsPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Insurance Claims" 
        description="Track and manage insurance claim approvals." 
      />
      <ClaimTable />
    </div>
  );
}
