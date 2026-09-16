import { apiClient } from "@/lib/api/client";
import type { PaginatedResponse } from "@/contracts/common";
import type { BloodUnit, BloodDonor, EmergencySOS, BloodInventorySummary } from "@/contracts/blood";

export const getBloodOverview = () => {
  return apiClient.get<{ totalUnits: number; availableUnits: number; activeSos: number; donors: number; }>(`/blood/overview`);
};

export const getBloodInventory = () => {
  return apiClient.get<BloodInventorySummary[]>(`/blood/inventory`);
};

export const getBloodUnits = () => {
  return apiClient.get<PaginatedResponse<BloodUnit>>(`/blood/units`);
};

export const getBloodDonors = () => {
  return apiClient.get<PaginatedResponse<BloodDonor>>(`/blood/donors`);
};

export const getBloodDonor = (id: string) => {
  return apiClient.get<BloodDonor>(`/blood/donors/${id}`);
};

export const getBloodSos = () => {
  return apiClient.get<PaginatedResponse<EmergencySOS>>(`/blood/sos`);
};

export const createBloodSos = (payload: Partial<EmergencySOS>) => {
  return apiClient.post<Partial<EmergencySOS>, EmergencySOS>(`/blood/sos`, payload);
};
