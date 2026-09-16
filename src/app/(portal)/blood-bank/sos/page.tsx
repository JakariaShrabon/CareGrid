import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-container";
import { SosList } from "@/features/blood-bank/components/sos-list";
import { CreateSosForm } from "@/features/blood-bank/components/create-sos-form";
import { ROUTES } from "@/config/routes";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

export default function BloodSosPage() {
  const breadcrumbs = [
    { label: "Blood Bank", href: ROUTES.bloodBank.root, current: false },
    { label: "Emergency SOS", href: ROUTES.bloodBank.sos, current: true },
  ];

  return (
    <div className="flex flex-col h-full">
      <Breadcrumbs items={breadcrumbs} />
      <PageContainer>
        <PageHeader 
          title="Emergency SOS Broadcast" 
          description="Initiate and monitor active emergency blood shortage broadcasts across the eligible donor network." 
        />
        
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-lg font-semibold text-slate-900">Active SOS Requests</h2>
            <SosList />
          </div>
          <div className="lg:col-span-1 lg:sticky lg:top-6">
            <CreateSosForm />
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
