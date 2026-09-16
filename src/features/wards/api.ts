import type { Ward } from "@/contracts/ward";
import { apiClient } from "@/lib/api/client";

export function listWards() {
  return apiClient.get<Ward[]>("/wards");
}
