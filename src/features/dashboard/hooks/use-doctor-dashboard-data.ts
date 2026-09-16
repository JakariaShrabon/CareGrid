import { usePatients } from "@/features/patients/hooks/use-patients";
import { useOrganOverview } from "@/features/organ/hooks/use-organ";
import { useNotifications } from "@/features/notifications/hooks/use-notifications";
import { useMemo } from "react";

export function useDoctorDashboardData() {
  const { data: patients, isLoading: patientsLoading, error: patientsError } = usePatients();
  const { data: organOverview, isLoading: organLoading, error: organError } = useOrganOverview();
  const { data: notifications, isLoading: notificationsLoading, error: notificationsError } = useNotifications();

  const isLoading = patientsLoading || organLoading || notificationsLoading;
  const error = patientsError || organError || notificationsError;

  const activePatients = useMemo(() => {
    if (!patients) return 0;
    return patients.items.length; // Active assigned patients conceptually
  }, [patients]);

  const availableBeds = useMemo(() => {
    return 0;
  }, []);

  return {
    data: {
      activePatients,
      organOverview: organOverview,
      availableBeds,
      recentNotifications: notifications?.items || [],
    },
    isLoading,
    error,
  };
}
