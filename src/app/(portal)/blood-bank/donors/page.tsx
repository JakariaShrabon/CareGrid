import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-container";
import { DonorTable } from "@/features/blood-bank/components/donor-table";
import { ROUTES } from "@/config/routes";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export default function BloodDonorsPage() {
  const breadcrumbs = [
    { label: "Blood Bank", href: ROUTES.bloodBank.root, current: false },
    { label: "Donors", href: ROUTES.bloodBank.donors, current: true },
  ];

  return (
    <div className="flex flex-col h-full">
      <Breadcrumbs items={breadcrumbs} />
      <PageContainer>
        <PageHeader 
          title="Donor Directory" 
          description="View registered donors and operational eligibility status for outreach and emergency planning." 
        />
        
        <div className="mt-6">
          <DonorTable />
        </div>
      </PageContainer>
    </div>
  );
}
