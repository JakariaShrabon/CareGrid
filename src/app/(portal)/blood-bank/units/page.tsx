import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-container";
import { BloodUnitTable } from "@/features/blood-bank/components/blood-unit-table";
import { ROUTES } from "@/config/routes";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export default function BloodUnitsPage() {
  const breadcrumbs = [
    { label: "Blood Bank", href: ROUTES.bloodBank.root, current: false },
    { label: "Blood Units", href: ROUTES.bloodBank.units, current: true },
  ];

  return (
    <div className="flex flex-col h-full">
      <Breadcrumbs items={breadcrumbs} />
      <PageContainer>
        <PageHeader 
          title="Blood Units" 
          description="View and filter individual registered blood units, manage stock and monitor expiration times." 
        />
        
        <div className="mt-6">
          <BloodUnitTable />
        </div>
      </PageContainer>
    </div>
  );
}
