import { usePrescriptions, usePharmacyInventory } from "@/features/pharmacy/hooks/use-pharmacy";
import { useNotifications } from "@/features/notifications/hooks/use-notifications";
import { useMemo } from "react";

export function usePharmacistDashboardData() {
  const { data: prescriptions, isLoading: prescriptionsLoading, error: prescriptionsError } = usePrescriptions();
  const { data: inventory, isLoading: inventoryLoading, error: inventoryError } = usePharmacyInventory();
  const { data: notifications, isLoading: notificationsLoading, error: notificationsError } = useNotifications();

  const isLoading = prescriptionsLoading || inventoryLoading || notificationsLoading;
  const error = prescriptionsError || inventoryError || notificationsError;

  const pendingPrescriptions = useMemo(() => {
    if (!prescriptions) return 0;
    return prescriptions.items.filter((p) => p.status === "PENDING").length;
  }, [prescriptions]);

  const readyPrescriptions = useMemo(() => {
    if (!prescriptions) return 0;
    return prescriptions.items.filter((p) => p.status === "READY").length;
  }, [prescriptions]);

  const lowStockMedicines = useMemo(() => {
    if (!inventory) return 0;
    return inventory.items.filter((m) => m.availableQuantity <= m.lowStockThreshold).length;
  }, [inventory]);

  return {
    data: {
      pendingPrescriptions,
      readyPrescriptions,
      lowStockMedicines,
      recentNotifications: notifications?.items || [],
    },
    isLoading,
    error,
  };
}
