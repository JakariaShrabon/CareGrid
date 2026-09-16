import { useBloodOverview, useBloodSos } from "@/features/blood-bank/hooks/use-blood-bank";
import { useNotifications } from "@/features/notifications/hooks/use-notifications";
import { useMemo } from "react";

export function useBloodBankDashboardData() {
  const { data: overview, isLoading: overviewLoading, error: overviewError } = useBloodOverview();
  const { data: sos, isLoading: sosLoading, error: sosError } = useBloodSos();
  const { data: notifications, isLoading: notificationsLoading, error: notificationsError } = useNotifications();

  const isLoading = overviewLoading || sosLoading || notificationsLoading;
  const error = overviewError || sosError || notificationsError;

  const activeSosCount = useMemo(() => {
    if (!sos) return 0;
    return sos.items.filter((s) => s.status === "ACTIVE").length;
  }, [sos]);

  return {
    data: {
      overview: overview,
      activeSosCount,
      recentNotifications: notifications?.items || [],
    },
    isLoading,
    error,
  };
}
