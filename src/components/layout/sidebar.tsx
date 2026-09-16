"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";

import type { NavigationItem } from "@/config/navigation";
import type { AuthUser } from "@/contracts/auth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

const groupLabels: Record<NavigationItem["group"], string> = {
  workspace: "Workspace",
  operations: "Care Operations",
  account: "Account",
};

function BrandMark() {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
      CG
    </div>
  );
}

export function Sidebar({
  items,
  user,
  variant = "desktop",
  open = true,
  onClose,
}: {
  items: NavigationItem[];
  user: AuthUser;
  variant?: "desktop" | "mobile";
  open?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname();
  const groupedItems = items.reduce<Record<NavigationItem["group"], NavigationItem[]>>(
    (acc, item) => {
      acc[item.group].push(item);
      return acc;
    },
    { workspace: [], operations: [], account: [] },
  );

  const content = (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-3">
          <BrandMark />
          <div>
            <p className="text-sm font-semibold text-slate-950">CareGrid.io</p>
            <p className="text-xs text-muted-foreground">Hospital coordination</p>
          </div>
        </div>
        {variant === "mobile" ? (
          <Button variant="ghost" size="icon" aria-label="Close navigation" onClick={onClose}>
            <X className="h-4 w-4" aria-hidden />
          </Button>
        ) : null}
      </div>

      <div className="border-b border-border px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Current role
        </p>
        <p className="mt-1 text-sm font-semibold text-slate-900">
          {user.role.replaceAll("_", " ")}
        </p>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto p-3" aria-label="Primary navigation">
        {Object.entries(groupedItems).map(([group, groupItems]) =>
          groupItems.length > 0 ? (
            <div key={group} className="space-y-1.5">
              <p className="px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {groupLabels[group as NavigationItem["group"]]}
              </p>
              {groupItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    onClick={onClose}
                    className={cn(
                      "flex min-h-10 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600 outline-none transition-colors hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-ring",
                      isActive && "bg-primary/10 text-primary",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ) : null,
        )}
      </nav>

      <div className="border-t border-border p-4">
        <p className="truncate text-sm font-medium text-slate-900">{user.name}</p>
        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
      </div>
    </div>
  );

  if (variant === "mobile") {
    return (
      <div
        className={cn(
          "fixed inset-0 z-50 lg:hidden",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
        aria-hidden={!open}
      >
        <div
          className={cn(
            "absolute inset-0 bg-slate-950/40 transition-opacity",
            open ? "opacity-100" : "opacity-0",
          )}
          onClick={onClose}
        />
        <aside
          className={cn(
            "absolute inset-y-0 left-0 w-[min(20rem,calc(100vw-2rem))] border-r border-border shadow-xl transition-transform",
            open ? "translate-x-0" : "-translate-x-full",
          )}
          aria-label="Mobile navigation"
        >
          {content}
        </aside>
      </div>
    );
  }

  return (
    <aside className="hidden h-[100dvh] w-72 shrink-0 overflow-hidden border-r border-border bg-white lg:block">
      {content}
    </aside>
  );
}
