import { usePatient, usePatientUpdates, usePatientAdmission } from "@/features/patients/hooks/use-patients";
import { useNotifications } from "@/features/notifications/hooks/use-notifications";
import { useAuth } from "@/features/auth/auth-provider";
import { useMemo } from "react";

export function useFamilyDashboardData() {
  const { session } = useAuth();
  const patientId = session?.user.patientId || "";

  const { data: patient, isLoading: patientLoading, error: patientError } = usePatient(patientId);
  const { data: admission, isLoading: admissionLoading, error: admissionError } = usePatientAdmission(patientId);
  const { data: updates, isLoading: updatesLoading, error: updatesError } = usePatientUpdates(patientId);
  const { data: notifications, isLoading: notificationsLoading, error: notificationsError } = useNotifications();

  const isLoading = patientLoading || admissionLoading || updatesLoading || notificationsLoading;
  const error = patientError || admissionError || updatesError || notificationsError;

  const latestUpdate = useMemo(() => {
    if (!updates || updates.length === 0) return null;
    return updates[0];
  }, [updates]);

  return {
    data: {
      patient: patient,
      admission: admission,
      latestUpdate,
      recentNotifications: notifications?.items || [],
    },
    isLoading,
    error,
  };
}
