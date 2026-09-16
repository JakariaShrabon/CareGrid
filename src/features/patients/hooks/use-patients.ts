import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { patientKeys } from "../api/patients.keys";
import {
  getPatients,
  getPatient,
  getPatientAdmission,
  getPatientVitals,
  createPatientVital,
  getPatientUpdates,
  createPatientUpdate,
  getPatientLabResults,
} from "../api/patients.api";

export function usePatients(filters?: { search?: string }) {
  return useQuery({
    queryKey: patientKeys.list(filters || {}),
    queryFn: () => getPatients(filters),
  });
}

export function usePatient(id: string) {
  return useQuery({
    queryKey: patientKeys.detail(id),
    queryFn: () => getPatient(id),
    enabled: !!id,
  });
}

export function usePatientAdmission(id: string) {
  return useQuery({
    queryKey: patientKeys.admission(id),
    queryFn: () => getPatientAdmission(id),
    enabled: !!id,
  });
}

export function usePatientVitals(id: string) {
  return useQuery({
    queryKey: patientKeys.vitals(id),
    queryFn: () => getPatientVitals(id),
    enabled: !!id,
  });
}

export function useCreatePatientVital() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof createPatientVital>[1] }) =>
      createPatientVital(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: patientKeys.vitals(id) });
    },
  });
}

export function usePatientUpdates(id: string) {
  return useQuery({
    queryKey: patientKeys.updates(id),
    queryFn: () => getPatientUpdates(id),
    enabled: !!id,
  });
}

export function useCreatePatientUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof createPatientUpdate>[1] }) =>
      createPatientUpdate(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: patientKeys.updates(id) });
    },
  });
}

export function usePatientLabResults(id: string) {
  return useQuery({
    queryKey: patientKeys.labResults(id),
    queryFn: () => getPatientLabResults(id),
    enabled: !!id,
  });
}
