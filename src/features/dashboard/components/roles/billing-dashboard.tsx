import { FileCheck, FileSignature, ReceiptText } from "lucide-react";
import { useBillingDashboardData } from "../../hooks/use-billing-dashboard-data";
import { DashboardStatGrid } from "../shared/dashboard-stat-grid";
import { DashboardQuickActions, DashboardQuickActionProps } from "../shared/dashboard-quick-actions";
import { DashboardSection } from "../shared/dashboard-section";
import { RecentNotificationList } from "../shared/recent-notification-list";
import { StatCard } from "@/components/data-display/stat-card";
import { LoadingState } from "@/components/feedback/loading-state";
import { ErrorState } from "@/components/feedback/error-state";

const quickActions: DashboardQuickActionProps[] = [
  { label: "Bills", href: "/billing/bills", icon: ReceiptText, requiredPermission: "billing.read", colorClass: "bg-blue-100 text-blue-600" },
  { label: "Claims", href: "/billing/claims", icon: FileSignature, requiredPermission: "insurance.read", colorClass: "bg-emerald-100 text-emerald-600" },
  { label: "Discharges", href: "/billing/discharge", icon: FileCheck, requiredPermission: "discharge.read", colorClass: "bg-purple-100 text-purple-600" },
];

export function BillingDashboard() {
  const { data, isLoading, error } = useBillingDashboardData();

  if (isLoading) {
    return <LoadingState label="Loading your dashboard..." />;
  }

  if (error) {
    return <ErrorState title="Dashboard Error" description="Could not load dashboard data." />;
  }

  return (
    <div className="space-y-6">
      <DashboardSection title="Overview">
        <DashboardStatGrid>
          <StatCard
            title="Open Bills"
            value={data.openBills.toString()}
            icon={ReceiptText}
            statusLabel={data.openBills > 0 ? "Pending processing" : "All cleared"}
            statusTone={data.openBills > 0 ? "warning" : "success"}
          />
          <StatCard
            title="Pending Claims"
            value={data.pendingClaims.toString()}
            icon={FileSignature}
            statusLabel={data.pendingClaims > 0 ? "Awaiting insurer" : "All resolved"}
            statusTone={data.pendingClaims > 0 ? "info" : "neutral"}
          />
          <StatCard
            title="Recent Discharges"
            value={data.recentDischarges.toString()}
            icon={FileCheck}
            description="Ready for final review"
          />
        </DashboardStatGrid>
      </DashboardSection>

      <DashboardSection title="Quick Actions">
        <DashboardQuickActions actions={quickActions} />
      </DashboardSection>

      <div className="grid gap-6 md:grid-cols-2">
        <RecentNotificationList notifications={data.recentNotifications} />
      </div>
    </div>
  );
}
