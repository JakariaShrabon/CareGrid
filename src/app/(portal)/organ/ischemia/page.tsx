import { PageContainer, PageHeader } from "@/components/layout/page-container";
import { OrganTransitList } from "@/features/organ/components/organ-transit-list";

export const metadata = {
  title: "Cold-Ischemia Tracker | Organ | CareGrid",
  description: "Monitor live preservation windows for organs in transit.",
};

export default function IschemiaTrackerPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Cold-Ischemia Tracker"
        description="Active logistics and clinical preservation monitoring."
      />

      <div className="mt-6">
        <OrganTransitList />
      </div>
    </PageContainer>
  );
}
