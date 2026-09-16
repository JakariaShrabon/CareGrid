import { PageContainer, PageHeader } from "@/components/layout/page-container";
import { OrganOverviewCards } from "@/features/organ/components/organ-overview-cards";
import Link from "next/link";
import { ROUTES } from "@/config/routes";
import { ChevronRight } from "lucide-react";

export const metadata = {
  title: "Organ Operations | CareGrid",
  description: "Organ donation, compatibility, and transit management.",
};

export default function OrganPage() {
  return (
    <PageContainer>
      <PageHeader
        title="Organ Operations"
        description="Monitor compatibility matches, waiting lists, living donors, and organs in transit."
      />

      <div className="space-y-8">
        <OrganOverviewCards />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col overflow-hidden rounded-lg border border-cyan-100/80 bg-gradient-to-br from-white via-cyan-50/50 to-emerald-50/40 shadow-sm">
            <div className="border-b border-cyan-100/80 bg-gradient-to-r from-white via-cyan-50/70 to-emerald-50/60 p-5">
              <h3 className="font-semibold text-slate-900">Compatibility Matching</h3>
              <p className="text-sm text-muted-foreground mt-1">Review system-generated match assessments.</p>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-center">
              <p className="text-sm text-slate-600 mb-4">
                The matching engine scores potential pairs based on blood group, HLA typing, clinical urgency, and logistics.
              </p>
              <Link 
                href={ROUTES.organ.matches}
                className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 mt-auto"
              >
                View matches <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="flex flex-col overflow-hidden rounded-lg border border-cyan-100/80 bg-gradient-to-br from-white via-sky-50/50 to-cyan-50/40 shadow-sm">
            <div className="border-b border-cyan-100/80 bg-gradient-to-r from-white via-sky-50/70 to-cyan-50/60 p-5">
              <h3 className="font-semibold text-slate-900">Cold-Ischemia Tracker</h3>
              <p className="text-sm text-muted-foreground mt-1">Monitor organs currently in transit.</p>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-center">
              <p className="text-sm text-slate-600 mb-4">
                Track safe preservation windows and logistics for recovered organs en route to recipients.
              </p>
              <Link 
                href={ROUTES.organ.ischemia}
                className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 mt-auto"
              >
                View transit tracker <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
