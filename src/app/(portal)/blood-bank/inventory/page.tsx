import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-container";
import { InventoryTable } from "@/features/blood-bank/components/inventory-table";
import { ROUTES } from "@/config/routes";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export default function InventoryPage() {
  const breadcrumbs = [
    { label: "Blood Bank", href: ROUTES.bloodBank.root, current: false },
    { label: "Inventory", href: ROUTES.bloodBank.inventory, current: true },
  ];

  return (
    <div className="flex flex-col h-full">
      <Breadcrumbs items={breadcrumbs} />
      <PageContainer>
        <PageHeader 
          title="Component Inventory" 
          description="Aggregate view of available blood products across all registered storage units." 
        />
        
        <div className="mt-6">
          <InventoryTable />
        </div>
      </PageContainer>
    </div>
  );
}
