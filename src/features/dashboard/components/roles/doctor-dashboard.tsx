import { Bed, Clock, HeartPulse, Pill, Users } from "lucide-react";
import { useDoctorDashboardData } from "../../hooks/use-doctor-dashboard-data";
import { DashboardStatGrid } from "../shared/dashboard-stat-grid";
import { DashboardQuickActions, DashboardQuickActionProps } from "../shared/dashboard-quick-actions";
import { DashboardSection } from "../shared/dashboard-section";
import { RecentNotificationList } from "../shared/recent-notification-list";
import { StatCard } from "@/components/data-display/stat-card";
import { LoadingState } from "@/components/feedback/loading-state";
import { ErrorState } from "@/components/feedback/error-state";

const quickActions: DashboardQuickActionProps[] = [
  { label: "Patients", href: "/patients", icon: Users, requiredPermission: "patient.read", colorClass: "bg-blue-100 text-blue-600" },
  { label: "Matches", href: "/organ/matches", icon: HeartPulse, requiredPermission: "organ.match.read", colorClass: "bg-rose-100 text-rose-600" },
  { label: "Transit", href: "/organ/ischemia", icon: Clock, requiredPermission: "organ.match.read", colorClass: "bg-orange-100 text-orange-600" },
  { label: "Prescribe", href: "/pharmacy/prescriptions/new", icon: Pill, requiredPermission: "prescription.create", colorClass: "bg-purple-100 text-purple-600" },
  { label: "Wards", href: "/wards", icon: Bed, requiredPermission: "ward.read", colorClass: "bg-indigo-100 text-indigo-600" },
];

export function DoctorDashboard() {
  const { data, isLoading, error } = useDoctorDashboardData();

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
            title="Active Patients"
            value={data.activePatients.toString()}
            icon={Users}
            description="Assigned under your care"
          />
          <StatCard
            title="Active Matches"
            value={data.organOverview?.activeMatches.toString() || "0"}
            icon={HeartPulse}
            statusLabel={data.organOverview?.activeMatches ? "Action needed" : "Up to date"}
            statusTone={data.organOverview?.activeMatches ? "warning" : "success"}
          />
          <StatCard
            title="Organs in Transit"
            value={data.organOverview?.organsInTransit.toString() || "0"}
            icon={Clock}
            statusLabel={data.organOverview?.organsInTransit ? "Critical timing" : "Clear"}
            statusTone={data.organOverview?.organsInTransit ? "critical" : "neutral"}
          />
          <StatCard
            title="Available Beds"
            value={data.availableBeds.toString()}
            icon={Bed}
            description="Across all wards"
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
