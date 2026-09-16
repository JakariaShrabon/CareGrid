export type { ApiError, ApiResponse, PaginatedResponse } from "@/contracts/common";

export class CareGridApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly details?: Record<string, unknown>;

  constructor(input: {
    code: string;
    message: string;
    status: number;
    details?: Record<string, unknown>;
  }) {
    super(input.message);
    this.name = "CareGridApiError";
    this.code = input.code;
    this.status = input.status;
    this.details = input.details;
  }
}
