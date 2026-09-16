import { BillDetail } from "@/features/billing/components/bill-detail";
import { PageHeader } from "@/components/layout/page-container";

export default async function BillDetailPage({
  params,
}: {
  params: Promise<{ billId: string }>;
}) {
  const resolvedParams = await params;
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Bill Details" 
        description="Review itemized charges and payment status." 
      />
      <BillDetail billId={resolvedParams.billId} />
    </div>
  );
}
