import type { PatientSummary } from "@/contracts/patient";
import { apiClient } from "@/lib/api/client";

export function listPatients() {
  return apiClient.get<PatientSummary[]>("/patients");
}
