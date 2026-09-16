import { PageContainer, PageHeader } from "@/components/layout/page-container";
import { WaitingListTable } from "@/features/organ/components/waiting-list-table";

export const metadata = {
  title: "Waiting List | Organ | CareGrid",
  description: "View the prioritized organ recipient waiting list.",
};

export default function WaitingListPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Recipient Waiting List"
        description="Priority queue ranked by backend clinical assessment factors."
      />

      <div className="mt-6">
        <WaitingListTable />
      </div>
    </PageContainer>
  );
}
