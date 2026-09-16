import { Activity, Bed, ClipboardList, Users } from "lucide-react";
import { useNurseDashboardData } from "../../hooks/use-nurse-dashboard-data";
import { DashboardStatGrid } from "../shared/dashboard-stat-grid";
import { DashboardQuickActions, DashboardQuickActionProps } from "../shared/dashboard-quick-actions";
import { DashboardSection } from "../shared/dashboard-section";
import { RecentNotificationList } from "../shared/recent-notification-list";
import { StatCard } from "@/components/data-display/stat-card";
import { LoadingState } from "@/components/feedback/loading-state";
import { ErrorState } from "@/components/feedback/error-state";

const quickActions: DashboardQuickActionProps[] = [
  { label: "Patients", href: "/patients", icon: Users, requiredPermission: "patient.read", colorClass: "bg-blue-100 text-blue-600" },
  { label: "Record Vitals", href: "/patients", icon: Activity, requiredPermission: "patient.vitals.write", colorClass: "bg-rose-100 text-rose-600" },
  { label: "Daily Updates", href: "/patients", icon: ClipboardList, requiredPermission: "patient.update.write", colorClass: "bg-emerald-100 text-emerald-600" },
  { label: "Wards", href: "/wards", icon: Bed, requiredPermission: "ward.read", colorClass: "bg-indigo-100 text-indigo-600" },
];

export function NurseDashboard() {
  const { data, isLoading, error } = useNurseDashboardData();

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
            title="Assigned Patients"
            value={data.activePatients.toString()}
            icon={Users}
            description="Under your care today"
          />
          <StatCard
            title="Available Beds"
            value={data.bedStatus.available.toString()}
            icon={Bed}
            description={`Out of ${data.bedStatus.total} total beds`}
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
