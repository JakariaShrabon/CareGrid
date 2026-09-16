import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { billingKeys } from "../api/billing.keys";
import {
  getBills,
  getBill,
  getInsuranceClaims,
  getInsuranceClaim,
  updateInsuranceClaim,
  getDischarges,
  getDischarge,
  downloadDischargePdf,
} from "../api/billing.api";

export function useBills() {
  return useQuery({
    queryKey: billingKeys.bills(),
    queryFn: getBills,
  });
}

export function useBill(id: string) {
  return useQuery({
    queryKey: billingKeys.bill(id),
    queryFn: () => getBill(id),
    enabled: !!id,
  });
}

export function useInsuranceClaims() {
  return useQuery({
    queryKey: billingKeys.claims(),
    queryFn: getInsuranceClaims,
  });
}

export function useInsuranceClaim(id: string) {
  return useQuery({
    queryKey: billingKeys.claim(id),
    queryFn: () => getInsuranceClaim(id),
    enabled: !!id,
  });
}

export function useUpdateInsuranceClaim() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof updateInsuranceClaim>[1] }) =>
      updateInsuranceClaim(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: billingKeys.claim(id) });
      queryClient.invalidateQueries({ queryKey: billingKeys.claims() });
    },
  });
}

export function useDischarges() {
  return useQuery({
    queryKey: billingKeys.discharges(),
    queryFn: getDischarges,
  });
}

export function useDischarge(patientId: string) {
  return useQuery({
    queryKey: [...billingKeys.discharges(), "patient", patientId],
    queryFn: () => getDischarge(patientId),
    enabled: !!patientId,
  });
}

export function useDownloadDischargePdf() {
  return useMutation({
    mutationFn: (patientId: string) => downloadDischargePdf(patientId),
  });
}
