"use client";

import { useOrganOverview } from "@/features/organ/hooks/use-organ";
import { LoadingState } from "@/components/feedback/loading-state";
import { ErrorState } from "@/components/feedback/error-state";
import { HeartPulse, Users, UserCheck, Truck } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { cn } from "@/lib/utils/cn";

export function OrganOverviewCards() {
  const { data: overviewRes, isLoading, error } = useOrganOverview();

  if (isLoading) {
    return (
      <div className="rounded-lg border border-cyan-100/80 bg-gradient-to-br from-white via-cyan-50/50 to-emerald-50/40 p-4 shadow-sm">
        <LoadingState label="Loading overview metrics..." />
      </div>
    );
  }

  if (error || !overviewRes) {
    return (
      <div className="rounded-lg border border-rose-100/80 bg-gradient-to-br from-white via-rose-50/70 to-amber-50/60 p-6 shadow-sm">
        <ErrorState title="Failed to load metrics" description="There was a problem loading the organ overview." />
      </div>
    );
  }

  const metrics = overviewRes;

  const cards = [
    {
      label: "Active Matches",
      value: metrics.activeMatches ?? 0,
      icon: HeartPulse,
      href: ROUTES.organ.matches,
      color: "text-rose-600",
      bgColor: "bg-rose-100",
    },
    {
      label: "Waiting List",
      value: metrics.waitingListCount ?? 0,
      icon: Users,
      href: ROUTES.organ.waitingList,
      color: "text-amber-600",
      bgColor: "bg-amber-100",
    },
    {
      label: "Living Donors",
      value: metrics.donorsAvailable ?? 0,
      icon: UserCheck,
      href: ROUTES.organ.livingDonors,
      color: "text-emerald-600",
      bgColor: "bg-emerald-100",
    },
    {
      label: "Organs In Transit",
      value: metrics.organsInTransit ?? 0,
      icon: Truck,
      href: ROUTES.organ.ischemia,
      color: "text-sky-600",
      bgColor: "bg-sky-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Link
            key={card.label}
            href={card.href}
            className="group flex flex-col rounded-lg border border-cyan-100/80 bg-gradient-to-br from-white via-cyan-50/50 to-emerald-50/40 p-5 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
          >
            <div className="flex items-center gap-4">
              <div className={cn("rounded-full p-3 transition-transform group-hover:scale-110", card.bgColor)}>
                <Icon className={cn("h-6 w-6", card.color)} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{card.label}</p>
                <p className="text-2xl font-semibold text-slate-900">{card.value}</p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
