"use client";

import { PageContainer, PageHeader } from "@/components/layout/page-container";
import { PharmacyInventoryTable } from "@/features/pharmacy/components/pharmacy-inventory-table";

export default function PharmacyInventoryPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="Pharmacy Inventory"
          description="View active medication stock levels and status."
          eyebrow="Pharmacy"
        />
        <PharmacyInventoryTable />
      </div>
    </PageContainer>
  );
}
