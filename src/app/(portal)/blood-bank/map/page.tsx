import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-container";
import { DonorMapWrapper } from "@/features/blood-bank/components/donor-map-wrapper";
import { ROUTES } from "@/config/routes";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export default function BloodMapPage() {
  const breadcrumbs = [
    { label: "Blood Bank", href: ROUTES.bloodBank.root, current: false },
    { label: "Donor Map", href: ROUTES.bloodBank.map, current: true },
  ];

  return (
    <div className="flex flex-col h-full">
      <Breadcrumbs items={breadcrumbs} />
      <PageContainer>
        <PageHeader 
          title="Geofenced Donor Map" 
          description="Visualize the distribution of nearby eligible donors for targeted emergency outreach." 
        />
        
        <div className="mt-6">
          <DonorMapWrapper />
        </div>
      </PageContainer>
    </div>
  );
}
