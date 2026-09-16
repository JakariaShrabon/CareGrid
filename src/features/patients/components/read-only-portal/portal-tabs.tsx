"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Clock, FileText } from "lucide-react";

export function ReadOnlyPortalTabs({ basePath }: { basePath: string }) {
  const pathname = usePathname();

  const tabs = [
    {
      name: "Overview",
      href: `${basePath}`,
      icon: Activity,
      exact: true,
    },
    {
      name: "Updates",
      href: `${basePath}/updates`,
      icon: Clock,
      exact: false,
    },
    {
      name: "Discharge Info",
      href: `${basePath}/discharge`,
      icon: FileText,
      exact: false,
    },
  ];

  return (
    <div className="overflow-x-auto">
      <nav
        className="flex min-w-max gap-2 rounded-lg border border-border bg-white p-1 shadow-sm"
        aria-label="Tabs"
      >
        {tabs.map((tab) => {
          const isActive = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={`
                flex min-h-10 items-center gap-2 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors
                ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-slate-50 hover:text-foreground"
                }
              `}
              aria-current={isActive ? "page" : undefined}
            >
              <tab.icon className="h-4 w-4" aria-hidden />
              {tab.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
