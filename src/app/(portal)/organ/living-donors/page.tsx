import { PageContainer, PageHeader } from "@/components/layout/page-container";
import { LivingDonorTable } from "@/features/organ/components/living-donor-table";

export const metadata = {
  title: "Living Donors | Organ | CareGrid",
  description: "Staff view of living donor registrations and screening status.",
};

export default function LivingDonorsPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Living Donor Registry"
        description="Privacy-conscious screening tracking for living organ donors."
      />

      <div className="mt-6">
        <LivingDonorTable />
      </div>
    </PageContainer>
  );
}
