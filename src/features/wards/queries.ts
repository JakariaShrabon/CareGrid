import { useQuery } from "@tanstack/react-query";

import { listWards } from "./api";

export const wardQueryKeys = {
  all: ["wards"] as const,
};

export function useWardsQuery() {
  return useQuery({
    queryKey: wardQueryKeys.all,
    queryFn: listWards,
  });
}
