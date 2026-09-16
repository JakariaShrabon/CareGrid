import { ClaimDetail } from "@/features/billing/components/claim-detail";
import { PageHeader } from "@/components/layout/page-container";

export default async function ClaimDetailPage({
  params,
}: {
  params: Promise<{ claimId: string }>;
}) {
  const resolvedParams = await params;
  return (
    <div className="space-y-6">
      <PageHeader 
        title="Claim Review" 
        description="Review and update insurance claim decisions." 
      />
      <ClaimDetail claimId={resolvedParams.claimId} />
    </div>
  );
}
