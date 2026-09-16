import { apiClient } from "@/lib/api/client";
import type { PaginatedResponse } from "@/contracts/common";
import type { Prescription, PharmacyInventoryItem, PrescriptionSafetyResult, DispenseRecord, Medicine } from "@/contracts/pharmacy";

export const getMedicines = () => {
  return apiClient.get<PaginatedResponse<Medicine>>(`/medicines`);
};

export const getPrescriptions = () => {
  return apiClient.get<PaginatedResponse<Prescription>>(`/prescriptions`);
};

export const getPrescription = (id: string) => {
  return apiClient.get<Prescription>(`/prescriptions/${id}`);
};

export const createPrescription = (payload: Partial<Prescription>) => {
  return apiClient.post<Partial<Prescription>, Prescription>(`/prescriptions`, payload);
};

export const checkPrescriptionSafety = (payload: { medicineIds: string[] }) => {
  return apiClient.post<{ medicineIds: string[] }, PrescriptionSafetyResult>(`/prescriptions/check-safety`, payload);
};

export const getPharmacyInventory = () => {
  return apiClient.get<PaginatedResponse<PharmacyInventoryItem>>(`/pharmacy/inventory`);
};

export const dispensePrescription = (payload: { prescriptionId: string, dispensedByUserId: string }) => {
  return apiClient.post<{ prescriptionId: string, dispensedByUserId: string }, DispenseRecord>(`/pharmacy/dispense`, payload);
};
