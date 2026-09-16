"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

import type { BreadcrumbItem } from "@/lib/navigation/breadcrumbs";

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex min-w-0 items-center gap-1 text-sm text-muted-foreground">
        {items.map((item, index) => (
          <li key={item.href} className="flex min-w-0 items-center gap-1">
            {index > 0 ? <ChevronRight className="h-3.5 w-3.5 shrink-0" aria-hidden /> : null}
            {item.current ? (
              <span className="truncate font-medium text-slate-700" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link href={item.href} className="truncate hover:text-primary focus-visible:rounded-sm">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
