import { AlertCircle, Droplets, MapPin, Package, Users } from "lucide-react";
import { useBloodBankDashboardData } from "../../hooks/use-blood-bank-dashboard-data";
import { DashboardStatGrid } from "../shared/dashboard-stat-grid";
import { DashboardQuickActions, DashboardQuickActionProps } from "../shared/dashboard-quick-actions";
import { DashboardSection } from "../shared/dashboard-section";
import { RecentNotificationList } from "../shared/recent-notification-list";
import { StatCard } from "@/components/data-display/stat-card";
import { LoadingState } from "@/components/feedback/loading-state";
import { ErrorState } from "@/components/feedback/error-state";

const quickActions: DashboardQuickActionProps[] = [
  { label: "Inventory", href: "/blood-bank/inventory", icon: Package, requiredPermission: "blood.inventory.read", colorClass: "bg-blue-100 text-blue-600" },
  { label: "Units", href: "/blood-bank/units", icon: Droplets, requiredPermission: "blood.inventory.read", colorClass: "bg-rose-100 text-rose-600" },
  { label: "Donors", href: "/blood-bank/donors", icon: Users, requiredPermission: "blood.donor.read", colorClass: "bg-emerald-100 text-emerald-600" },
  { label: "Emergency SOS", href: "/blood-bank/sos", icon: AlertCircle, requiredPermission: "blood.sos.create", colorClass: "bg-red-100 text-red-600" },
  { label: "Donor Map", href: "/blood-bank/map", icon: MapPin, requiredPermission: "blood.map.read", colorClass: "bg-indigo-100 text-indigo-600" },
];

export function BloodBankDashboard() {
  const { data, isLoading, error } = useBloodBankDashboardData();

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
            title="Total Units"
            value={data.overview?.totalUnits.toString() || "0"}
            icon={Droplets}
            description="Available in inventory"
          />
          <StatCard
            title="Available Units"
            value={data.overview?.availableUnits.toString() || "0"}
            icon={Package}
            statusLabel={data.overview?.availableUnits ? "Stock available" : "Empty"}
            statusTone={data.overview?.availableUnits ? "success" : "warning"}
          />
          <StatCard
            title="Registered Donors"
            value={data.overview?.donors.toString() || "0"}
            icon={Users}
            description="Total in system"
          />
          <StatCard
            title="Active SOS"
            value={data.activeSosCount.toString()}
            icon={AlertCircle}
            statusLabel={data.activeSosCount ? "Active emergencies" : "No emergencies"}
            statusTone={data.activeSosCount ? "critical" : "neutral"}
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
