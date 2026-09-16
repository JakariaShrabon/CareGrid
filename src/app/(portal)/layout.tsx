import type { ReactNode } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { RouteGuard } from "@/features/auth/route-guard";

export default function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <RouteGuard>
      <AppShell>{children}</AppShell>
    </RouteGuard>
  );
}
