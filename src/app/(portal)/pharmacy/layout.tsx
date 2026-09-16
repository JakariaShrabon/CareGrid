import { ReactNode } from "react";
import { PageContainer } from "@/components/layout/page-container";

export default function PharmacyLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <PageContainer>
      {children}
    </PageContainer>
  );
}
