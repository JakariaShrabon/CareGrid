 
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useRouter } from "next/navigation";

import { Bell, LogOut, Menu, Search, UserRound } from "lucide-react";

import type { AuthUser } from "@/contracts/auth";
import { Button } from "@/components/ui/button";
import { Breadcrumbs } from "./breadcrumbs";
import type { BreadcrumbItem } from "@/lib/navigation/breadcrumbs";
import { useAuth } from "@/features/auth/auth-provider";

import { useNotifications } from "@/features/notifications/hooks/use-notifications";
import Link from "next/link";

export function Topbar({
  user,
  breadcrumbs,
  onMenuClick,
  mobileMenuOpen,
}: {
  user: AuthUser;
  breadcrumbs: BreadcrumbItem[];
  onMenuClick: () => void;
  mobileMenuOpen: boolean;
}) {
  const { logout } = useAuth();
  const router = useRouter();
  const { data: notificationsData } = useNotifications();
  const unreadCount = (notificationsData as any)?.data?.items?.filter((n: any) => !n.read).length ?? 0;

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/login");
    } catch {
      // Handle gracefully
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-white/95 px-3 backdrop-blur supports-[backdrop-filter]:bg-white/80 sm:px-4 lg:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Open navigation"
          aria-expanded={mobileMenuOpen}
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" aria-hidden />
        </Button>
        <div className="hidden min-w-0 sm:block">
          <Breadcrumbs items={breadcrumbs} />
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <Search className="h-3.5 w-3.5" aria-hidden />
            <span className="truncate">Hospital context: CareGrid General</span>
          </div>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Notifications" asChild className="relative">
          <Link href="/notifications">
            <Bell className="h-4 w-4" aria-hidden />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-destructive" />
            )}
          </Link>
        </Button>
        <div className="hidden h-8 w-px bg-border sm:block" />
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UserRound className="h-4 w-4" aria-hidden />
          </div>
          <div className="hidden text-right md:block">
            <p className="text-sm font-medium text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.role.replaceAll("_", " ")}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" aria-label="Logout" onClick={handleLogout}>
          <LogOut className="h-4 w-4" aria-hidden />
        </Button>
      </div>
    </header>
  );
}
