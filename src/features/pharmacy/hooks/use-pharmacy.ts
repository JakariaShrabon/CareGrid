import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { pharmacyKeys } from "../api/pharmacy.keys";
import {
  getMedicines,
  getPrescriptions,
  getPrescription,
  createPrescription,
  checkPrescriptionSafety,
  getPharmacyInventory,
  dispensePrescription,
} from "../api/pharmacy.api";

export function useMedicines() {
  return useQuery({
    queryKey: pharmacyKeys.medicines(),
    queryFn: getMedicines,
  });
}

export function usePrescriptions() {
  return useQuery({
    queryKey: pharmacyKeys.prescriptions(),
    queryFn: getPrescriptions,
  });
}

export function usePrescription(id: string) {
  return useQuery({
    queryKey: pharmacyKeys.prescription(id),
    queryFn: () => getPrescription(id),
    enabled: !!id,
  });
}

export function useCreatePrescription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Parameters<typeof createPrescription>[0]) => createPrescription(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: pharmacyKeys.prescriptions() });
    },
  });
}

export function useCheckPrescriptionSafety() {
  return useMutation({
    mutationFn: (payload: Parameters<typeof checkPrescriptionSafety>[0]) => checkPrescriptionSafety(payload),
  });
}

export function usePharmacyInventory() {
  return useQuery({
    queryKey: pharmacyKeys.inventory(),
    queryFn: getPharmacyInventory,
  });
}

export function useDispensePrescription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Parameters<typeof dispensePrescription>[0]) => dispensePrescription(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: pharmacyKeys.prescription(variables.prescriptionId) });
      queryClient.invalidateQueries({ queryKey: pharmacyKeys.prescriptions() });
      queryClient.invalidateQueries({ queryKey: pharmacyKeys.inventory() });
    },
  });
}
