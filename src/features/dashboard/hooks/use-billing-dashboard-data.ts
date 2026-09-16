import { useBills, useInsuranceClaims, useDischarges } from "@/features/billing/hooks/use-billing";
import { useNotifications } from "@/features/notifications/hooks/use-notifications";
import { useMemo } from "react";

export function useBillingDashboardData() {
  const { data: bills, isLoading: billsLoading, error: billsError } = useBills();
  const { data: claims, isLoading: claimsLoading, error: claimsError } = useInsuranceClaims();
  const { data: discharges, isLoading: dischargesLoading, error: dischargesError } = useDischarges();
  const { data: notifications, isLoading: notificationsLoading, error: notificationsError } = useNotifications();

  const isLoading = billsLoading || claimsLoading || dischargesLoading || notificationsLoading;
  const error = billsError || claimsError || dischargesError || notificationsError;

  const openBills = useMemo(() => {
    if (!bills) return 0;
    return bills.items.filter((b) => b.status === "DRAFT" || b.status === "ISSUED" || b.status === "PARTIALLY_PAID").length;
  }, [bills]);

  const pendingClaims = useMemo(() => {
    if (!claims) return 0;
    return claims.items.filter((c) => c.status === "PENDING" || c.status === "UNDER_REVIEW").length;
  }, [claims]);

  const recentDischarges = useMemo(() => {
    if (!discharges) return 0;
    return discharges.items.length; // Just showing total as a metric for the demo
  }, [discharges]);

  return {
    data: {
      openBills,
      pendingClaims,
      recentDischarges,
      recentNotifications: notifications?.items || [],
    },
    isLoading,
    error,
  };
}
