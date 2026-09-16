import { useQuery, useMutation } from "@tanstack/react-query";
import { organKeys } from "../api/organ.keys";
import {
  getOrganOverview,
  getOrganMatches,
  getOrganMatch,
  getWaitingList,
  getOrganTransit,
  getLivingDonors,
  registerLivingDonor
} from "../api/organ.api";

export function useOrganOverview() {
  return useQuery({
    queryKey: organKeys.overview(),
    queryFn: getOrganOverview,
  });
}

export function useOrganMatches() {
  return useQuery({
    queryKey: organKeys.matches(),
    queryFn: getOrganMatches,
  });
}

export function useOrganMatch(id: string) {
  return useQuery({
    queryKey: organKeys.match(id),
    queryFn: () => getOrganMatch(id),
    enabled: !!id,
  });
}

export function useWaitingList() {
  return useQuery({
    queryKey: organKeys.waitingList(),
    queryFn: getWaitingList,
  });
}

export function useOrganTransit() {
  return useQuery({
    queryKey: organKeys.transit(),
    queryFn: getOrganTransit,
  });
}

export function useLivingDonors() {
  return useQuery({
    queryKey: organKeys.livingDonors(),
    queryFn: getLivingDonors,
  });
}

export function useRegisterLivingDonor() {
  return useMutation({
    mutationFn: (data: { bloodGroup?: string; organInterest: string; }) => registerLivingDonor(data)
  });
}
