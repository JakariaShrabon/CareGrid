import { apiClient } from "@/lib/api/client";
import type { PaginatedResponse } from "@/contracts/common";
import type { Ward, Bed, BedStatus } from "@/contracts/ward";

export const getWards = () => {
  return apiClient.get<PaginatedResponse<Ward>>(`/wards`);
};

export const getWard = (id: string) => {
  return apiClient.get<Ward>(`/wards/${id}`);
};

export const getWardBeds = (id: string) => {
  return apiClient.get<Bed[]>(`/wards/${id}/beds`);
};

export const updateBedStatus = (id: string, status: BedStatus) => {
  return apiClient.patch<{ status: BedStatus }, Bed>(`/beds/${id}/status`, { status });
};
