import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wardKeys } from "../api/wards.keys";
import { getWards, getWard, getWardBeds, updateBedStatus } from "../api/wards.api";

export function useWards() {
  return useQuery({
    queryKey: wardKeys.lists(),
    queryFn: getWards,
  });
}

export function useWard(id: string) {
  return useQuery({
    queryKey: wardKeys.detail(id),
    queryFn: () => getWard(id),
    enabled: !!id,
  });
}

export function useWardBeds(id: string) {
  return useQuery({
    queryKey: wardKeys.beds(id),
    queryFn: () => getWardBeds(id),
    enabled: !!id,
  });
}

export function useUpdateBedStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: Parameters<typeof updateBedStatus>[1] }) =>
      updateBedStatus(id, status),
    onSuccess: () => {
      // Invalidate all bed lists to ensure UI consistency
      queryClient.invalidateQueries({ queryKey: wardKeys.all });
    },
  });
}
