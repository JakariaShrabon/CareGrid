import { usePatients } from "@/features/patients/hooks/use-patients";
import { useNotifications } from "@/features/notifications/hooks/use-notifications";
import { useMemo } from "react";

export function useNurseDashboardData() {
  const { data: patients, isLoading: patientsLoading, error: patientsError } = usePatients();
  const { data: notifications, isLoading: notificationsLoading, error: notificationsError } = useNotifications();

  const isLoading = patientsLoading || notificationsLoading;
  const error = patientsError || notificationsError;

  const activePatients = useMemo(() => {
    if (!patients) return 0;
    return patients.items.length; // Active assigned patients conceptually
  }, [patients]);

  const bedStatus = useMemo(() => {
    return { available: 0, total: 0 };
  }, []);

  return {
    data: {
      activePatients,
      bedStatus,
      recentNotifications: notifications?.items || [],
    },
    isLoading,
    error,
  };
}
