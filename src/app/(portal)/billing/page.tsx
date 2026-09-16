import { BillingOverviewCards } from "@/features/billing/components/billing-overview-cards";
import { PageHeader } from "@/components/layout/page-container";

export default function BillingOverviewPage() {
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Billing Overview" 
        description="Monitor hospital billing operations, insurance claims, and discharges." 
      />
      <BillingOverviewCards />
    </div>
  );
}
