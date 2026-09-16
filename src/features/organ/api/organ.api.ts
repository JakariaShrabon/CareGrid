 
/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from "@/lib/api/client";
import type { PaginatedResponse } from "@/contracts/common";
import type { 
  OrganMatch, 
  WaitingListEntry, 
  OrganTransit,
  LivingDonorRegistration
} from "@/contracts/organ";

export const getOrganOverview = () => {
  return apiClient.get<{
    activeMatches: number;
    waitingListCount: number;
    donorsAvailable: number;
    organsInTransit: number;
  }>("/organ/overview");
};

export const getOrganMatches = () => {
  return apiClient.get<PaginatedResponse<OrganMatch>>("/organ/matches");
};

export const getOrganMatch = (id: string) => {
  return apiClient.get<OrganMatch>(`/organ/matches/${id}`);
};

export const getWaitingList = () => {
  return apiClient.get<PaginatedResponse<WaitingListEntry>>("/organ/waiting-list");
};

export const getOrganTransit = () => {
  return apiClient.get<PaginatedResponse<OrganTransit>>("/organ/transit");
};

export const getLivingDonors = () => {
  return apiClient.get<PaginatedResponse<LivingDonorRegistration>>("/organ/living-donors");
};

export const registerLivingDonor = (data: { bloodGroup?: string; organInterest: string; }) => {
  return apiClient.post<any, any>("/organ/living-donors/register", data);
};
