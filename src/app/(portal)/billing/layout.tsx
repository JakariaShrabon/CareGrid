import { PageContainer } from "@/components/layout/page-container";
import { ReactNode } from "react";

export default function BillingLayout({ children }: { children: ReactNode }) {
  return (
    <PageContainer>
      {children}
    </PageContainer>
  );
}
