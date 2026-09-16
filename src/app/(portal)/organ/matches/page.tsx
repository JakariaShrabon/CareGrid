import { PageContainer, PageHeader } from "@/components/layout/page-container";
import { OrganMatchList } from "@/features/organ/components/organ-match-list";

export const metadata = {
  title: "Compatibility Matches | Organ | CareGrid",
  description: "Review system-generated organ compatibility matches.",
};

export default function OrganMatchesPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Compatibility Matches"
        description="Ranked assessments based on blood group, HLA, urgency, and logistics."
      />

      <div className="mt-6">
        <OrganMatchList />
      </div>
    </PageContainer>
  );
}
