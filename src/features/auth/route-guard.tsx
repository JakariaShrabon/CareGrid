"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "./auth-provider";
import { LoadingState } from "@/components/feedback/loading-state";
import { canAccessRoute } from "@/lib/auth/rbac";

export function RouteGuard({ children }: { children: ReactNode }) {
  const { session, isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !session) {
      // Allow passing through public routes? 
      // No, RouteGuard will be used inside (portal)/layout.tsx, so everything here requires auth.
      const returnUrl = encodeURIComponent(pathname);
      router.replace(`/login?returnTo=${returnUrl}`);
      return;
    }

    if (!canAccessRoute(session.user.role, pathname)) {
      router.replace("/unauthorized");
      return;
    }

    setIsAuthorized(true);
  }, [isLoading, isAuthenticated, session, pathname, router]);

  if (isLoading || !isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <LoadingState label="Verifying access..." />
      </div>
    );
  }

  return <>{children}</>;
}
