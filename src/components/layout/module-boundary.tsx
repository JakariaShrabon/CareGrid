import { Construction } from "lucide-react";
import { PageContainer, PageHeader, PageSection } from "./page-container";
import { EmptyState } from "@/components/feedback/empty-state";

export function ModuleBoundary({ moduleName }: { moduleName: string }) {
  return (
    <PageContainer>
      <PageHeader
        eyebrow="Clinical Module"
        title={moduleName}
        description={`The ${moduleName} module is slated for development in a subsequent phase.`}
      />
      <PageSection>
        <EmptyState
          icon={Construction}
          title="Under Construction"
          description="This functional area has been defined in the role-based navigation and route boundaries, but the business logic and UI are not yet implemented."
        />
      </PageSection>
    </PageContainer>
  );
}
