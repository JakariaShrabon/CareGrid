"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { usePathname } from "next/navigation";

import { getNavigationForRole } from "@/config/navigation";
import { useCurrentUser } from "@/features/auth/use-current-user";
import { getBreadcrumbs } from "@/lib/navigation/breadcrumbs";

import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";

export function AppShell({ children }: { children: ReactNode }) {
  const { user } = useCurrentUser();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  if (!user) return null;

  const navigationItems = getNavigationForRole(user.role);
  const breadcrumbs = getBreadcrumbs(pathname);

  return (
    <div data-testid="app-shell" className="flex h-[100dvh] overflow-hidden bg-slate-50">
      <Sidebar items={navigationItems} user={user} />
      <Sidebar
        items={navigationItems}
        user={user}
        variant="mobile"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex h-[100dvh] min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar
          user={user}
          breadcrumbs={breadcrumbs}
          mobileMenuOpen={mobileMenuOpen}
          onMenuClick={() => setMobileMenuOpen(true)}
        />
        <main className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
