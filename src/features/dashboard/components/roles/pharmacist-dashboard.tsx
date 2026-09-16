import { AlertTriangle, CheckCircle, FileText, Package } from "lucide-react";
import { usePharmacistDashboardData } from "../../hooks/use-pharmacist-dashboard-data";
import { DashboardStatGrid } from "../shared/dashboard-stat-grid";
import { DashboardQuickActions, DashboardQuickActionProps } from "../shared/dashboard-quick-actions";
import { DashboardSection } from "../shared/dashboard-section";
import { RecentNotificationList } from "../shared/recent-notification-list";
import { StatCard } from "@/components/data-display/stat-card";
import { LoadingState } from "@/components/feedback/loading-state";
import { ErrorState } from "@/components/feedback/error-state";

const quickActions: DashboardQuickActionProps[] = [
  { label: "Prescription Queue", href: "/pharmacy/prescriptions", icon: FileText, requiredPermission: "prescription.read", colorClass: "bg-blue-100 text-blue-600" },
  { label: "Pharmacy Inventory", href: "/pharmacy/inventory", icon: Package, requiredPermission: "pharmacy.inventory.read", colorClass: "bg-emerald-100 text-emerald-600" },
];

export function PharmacistDashboard() {
  const { data, isLoading, error } = usePharmacistDashboardData();

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
            title="Pending Prescriptions"
            value={data.pendingPrescriptions.toString()}
            icon={FileText}
            statusLabel={data.pendingPrescriptions > 0 ? "Action needed" : "Queue clear"}
            statusTone={data.pendingPrescriptions > 0 ? "warning" : "success"}
          />
          <StatCard
            title="Ready to Dispense"
            value={data.readyPrescriptions.toString()}
            icon={CheckCircle}
            description="Awaiting patient pickup"
          />
          <StatCard
            title="Low Stock Medicines"
            value={data.lowStockMedicines.toString()}
            icon={AlertTriangle}
            statusLabel={data.lowStockMedicines > 0 ? "Restock needed" : "Healthy"}
            statusTone={data.lowStockMedicines > 0 ? "critical" : "success"}
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
