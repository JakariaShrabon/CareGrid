import { Activity, FileText, Stethoscope, ClipboardList } from "lucide-react";
import { format } from "date-fns";
import { usePatientDashboardData } from "../../hooks/use-patient-dashboard-data";
import { DashboardQuickActions, DashboardQuickActionProps } from "../shared/dashboard-quick-actions";
import { DashboardSection } from "../shared/dashboard-section";
import { RecentNotificationList } from "../shared/recent-notification-list";
import { StatCard } from "@/components/data-display/stat-card";
import { LoadingState } from "@/components/feedback/loading-state";
import { ErrorState } from "@/components/feedback/error-state";

const quickActions: DashboardQuickActionProps[] = [
  { label: "My Care Updates", href: "/my-care", icon: Stethoscope, requiredPermission: "patient.read", colorClass: "bg-blue-100 text-blue-600" },
  { label: "Discharge Info", href: "/my-care/discharge", icon: FileText, requiredPermission: "patient.read", colorClass: "bg-emerald-100 text-emerald-600" },
];

export function PatientDashboard() {
  const { data, isLoading, error } = usePatientDashboardData();

  if (isLoading) {
    return <LoadingState label="Loading your dashboard..." />;
  }

  if (error || !data.patient) {
    return <ErrorState title="Dashboard Error" description="Could not load your care data." />;
  }

  return (
    <div className="space-y-6">
      <DashboardSection title={`Welcome, ${data.patient.displayName}`}>
        <div className="grid max-w-3xl gap-4 md:grid-cols-2">
          <StatCard
            title="Blood Group"
            value={data.patient.bloodGroup || "Unknown"}
            icon={Activity}
            description="On medical record"
          />
          <StatCard
            title="Latest Update"
            value={data.latestUpdate ? format(new Date(data.latestUpdate.createdAt), "MMM d, yyyy") : "None yet"}
            icon={ClipboardList}
            description="From your care team"
          />
        </div>
      </DashboardSection>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
        <DashboardSection title="Quick Access">
          <DashboardQuickActions actions={quickActions} variant="care" />
        </DashboardSection>
        <DashboardSection title="Recent Updates">
          <RecentNotificationList notifications={data.recentNotifications} variant="compact" />
        </DashboardSection>
      </div>
    </div>
  );
}


