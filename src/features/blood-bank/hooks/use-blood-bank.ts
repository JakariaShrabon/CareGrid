import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bloodBankKeys } from "../api/blood-bank.keys";
import {
  getBloodOverview,
  getBloodInventory,
  getBloodUnits,
  getBloodDonors,
  getBloodDonor,
  getBloodSos,
  createBloodSos,
} from "../api/blood-bank.api";

export function useBloodOverview() {
  return useQuery({
    queryKey: bloodBankKeys.overview(),
    queryFn: getBloodOverview,
  });
}

export function useBloodInventory() {
  return useQuery({
    queryKey: bloodBankKeys.inventory(),
    queryFn: getBloodInventory,
  });
}

export function useBloodUnits() {
  return useQuery({
    queryKey: bloodBankKeys.units(),
    queryFn: getBloodUnits,
  });
}

export function useBloodDonors() {
  return useQuery({
    queryKey: bloodBankKeys.donors(),
    queryFn: getBloodDonors,
  });
}

export function useBloodDonor(id: string) {
  return useQuery({
    queryKey: bloodBankKeys.donor(id),
    queryFn: () => getBloodDonor(id),
    enabled: !!id,
  });
}

export function useBloodSos() {
  return useQuery({
    queryKey: bloodBankKeys.sos(),
    queryFn: getBloodSos,
  });
}

export function useCreateBloodSos() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Parameters<typeof createBloodSos>[0]) => createBloodSos(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bloodBankKeys.sos() });
      queryClient.invalidateQueries({ queryKey: bloodBankKeys.overview() });
    },
  });
}
