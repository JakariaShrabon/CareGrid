import type { ApiResponse } from "@/contracts/common";

export function createApiResponse<T>(data: T): ApiResponse<T> {
  return {
    data,
    meta: {
      requestId: "mock_req_factory",
      timestamp: "2026-09-12T00:00:00.000Z",
    },
  };
}
