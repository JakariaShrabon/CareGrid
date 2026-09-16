import { apiClient } from "@/lib/api/client";
import type { PaginatedResponse } from "@/contracts/common";
import type { Bill, InsuranceClaim, DischargeSummary } from "@/contracts/billing";

export const getBills = () => {
  return apiClient.get<PaginatedResponse<Bill>>(`/bills`);
};

export const getBill = (id: string) => {
  return apiClient.get<Bill>(`/bills/${id}`);
};

export const getInsuranceClaims = () => {
  return apiClient.get<PaginatedResponse<InsuranceClaim>>(`/insurance/claims`);
};

export const getInsuranceClaim = (id: string) => {
  return apiClient.get<InsuranceClaim>(`/insurance/claims/${id}`);
};

export const updateInsuranceClaim = (id: string, payload: Partial<InsuranceClaim>) => {
  return apiClient.patch<Partial<InsuranceClaim>, InsuranceClaim>(`/insurance/claims/${id}`, payload);
};

export const getDischarges = () => {
  return apiClient.get<PaginatedResponse<DischargeSummary>>(`/discharges`);
};

export const getDischarge = (patientId: string) => {
  return apiClient.get<DischargeSummary[]>(`/discharges/${patientId}`);
};

export const downloadDischargePdf = (patientId: string) => {
  return apiClient.getBlob(`/discharges/${patientId}/pdf`);
};
