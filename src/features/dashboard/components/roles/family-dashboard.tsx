import { FileText, Heart, ClipboardList } from "lucide-react";
import { format } from "date-fns";
import { useFamilyDashboardData } from "../../hooks/use-family-dashboard-data";
import { DashboardQuickActions, DashboardQuickActionProps } from "../shared/dashboard-quick-actions";
import { DashboardSection } from "../shared/dashboard-section";
import { RecentNotificationList } from "../shared/recent-notification-list";
import { StatCard } from "@/components/data-display/stat-card";
import { LoadingState } from "@/components/feedback/loading-state";
import { ErrorState } from "@/components/feedback/error-state";

const quickActions: DashboardQuickActionProps[] = [
  { label: "Patient Updates", href: "/family-care", icon: Heart, requiredPermission: "patient.read", colorClass: "bg-blue-100 text-blue-600" },
  { label: "Discharge Info", href: "/family-care/discharge", icon: FileText, requiredPermission: "discharge.read", colorClass: "bg-emerald-100 text-emerald-600" },
];

export function FamilyDashboard() {
  const { data, isLoading, error } = useFamilyDashboardData();

  if (isLoading) {
    return <LoadingState label="Loading family dashboard..." />;
  }

  if (error || !data.patient) {
    return <ErrorState title="Dashboard Error" description="Could not load patient data." />;
  }

  return (
    <div className="space-y-6">
      <DashboardSection title={`Care for ${data.patient.displayName}`}>
        <div className="grid max-w-3xl gap-4 md:grid-cols-2">
          <StatCard
            title="Room/Bed"
            value={data.admission?.wardId ? `${data.admission.wardId}` : "Unassigned"}
            icon={Heart}
            description="Current location"
          />
          <StatCard
            title="Latest Update"
            value={data.latestUpdate ? format(new Date(data.latestUpdate.createdAt), "MMM d, yyyy") : "None yet"}
            icon={ClipboardList}
            description="From the care team"
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


