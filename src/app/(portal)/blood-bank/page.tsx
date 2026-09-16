import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-container";
import { BloodOverviewCards } from "@/features/blood-bank/components/blood-overview-cards";
import { Droplets, PackageSearch, Users, Activity, Map, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export default function BloodBankOverviewPage() {
  const breadcrumbs = [
    { label: "Blood Bank", href: ROUTES.bloodBank.root, current: true },
  ];

  return (
    <div className="flex flex-col h-full">
      <Breadcrumbs items={breadcrumbs} />
      <PageContainer>
        <PageHeader 
          title="Blood Bank Module" 
          description="Operational overview of blood inventory, active emergency requests, and donor network." 
        />
        
        <div className="mt-6">
          <BloodOverviewCards />
        </div>

        <div className="mt-12">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">Module Navigation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <Link href={ROUTES.bloodBank.inventory} className="group flex flex-col rounded-xl border border-cyan-100/80 bg-gradient-to-br from-white via-cyan-50/50 to-emerald-50/40 p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                  <PackageSearch className="h-6 w-6" />
                </div>
                <ArrowRight className="h-5 w-5 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900">Inventory Matrix</h3>
              <p className="mt-2 text-sm text-slate-500">View aggregated blood inventory by group and component, with safe threshold monitoring.</p>
            </Link>

            <Link href={ROUTES.bloodBank.units} className="group flex flex-col rounded-xl border border-cyan-100/80 bg-gradient-to-br from-white via-emerald-50/50 to-cyan-50/40 p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <Droplets className="h-6 w-6" />
                </div>
                <ArrowRight className="h-5 w-5 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900">Blood Units</h3>
              <p className="mt-2 text-sm text-slate-500">Track individual blood units, expiration dates, and current dispensation status.</p>
            </Link>

            <Link href={ROUTES.bloodBank.donors} className="group flex flex-col rounded-xl border border-cyan-100/80 bg-gradient-to-br from-white via-indigo-50/40 to-cyan-50/40 p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Users className="h-6 w-6" />
                </div>
                <ArrowRight className="h-5 w-5 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900">Donor Directory</h3>
              <p className="mt-2 text-sm text-slate-500">Privacy-conscious directory of registered donors and eligibility status.</p>
            </Link>

            <Link href={ROUTES.bloodBank.sos} className="group flex flex-col rounded-xl border border-rose-100 bg-gradient-to-br from-white via-rose-50/70 to-amber-50/60 p-6 shadow-sm transition-all hover:border-rose-200 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
                  <Activity className="h-6 w-6" />
                </div>
                <ArrowRight className="h-5 w-5 text-rose-300 transition-transform group-hover:translate-x-1 group-hover:text-rose-600" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-rose-900">Emergency SOS</h3>
              <p className="mt-2 text-sm text-rose-600">Broadcast urgent blood shortage requests to matching eligible donors.</p>
            </Link>

            <Link href={ROUTES.bloodBank.map} className="group flex flex-col rounded-xl border border-cyan-100/80 bg-gradient-to-br from-white via-amber-50/40 to-cyan-50/40 p-6 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
              <div className="flex items-center justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <Map className="h-6 w-6" />
                </div>
                <ArrowRight className="h-5 w-5 text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </div>
              <h3 className="mt-4 text-base font-semibold text-slate-900">Donor Map</h3>
              <p className="mt-2 text-sm text-slate-500">Geospatial view of nearby eligible donors for rapid targeted outreach.</p>
            </Link>

          </div>
        </div>
      </PageContainer>
    </div>
  );
}
