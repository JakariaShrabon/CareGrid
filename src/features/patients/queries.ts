import { useQuery } from "@tanstack/react-query";

import { listPatients } from "./api";

export const patientQueryKeys = {
  all: ["patients"] as const,
};

export function usePatientsQuery() {
  return useQuery({
    queryKey: patientQueryKeys.all,
    queryFn: listPatients,
  });
}
