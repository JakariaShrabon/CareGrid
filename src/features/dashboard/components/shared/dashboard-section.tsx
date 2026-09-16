import { ReactNode } from "react";
import { PageSection, SectionHeader } from "@/components/layout/page-container";

interface DashboardSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export function DashboardSection({ title, description, children }: DashboardSectionProps) {
  return (
    <PageSection>
      <SectionHeader title={title} description={description} />
      {children}
    </PageSection>
  );
}
