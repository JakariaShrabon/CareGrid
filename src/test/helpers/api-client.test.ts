import { describe, expect, it, vi } from "vitest";

import { apiClient } from "@/lib/api/client";
import { getApiEnvironment } from "@/lib/api/environment";

describe("CareGrid API client foundation", () => {
  it("defaults to mock mode with the documented API base URL", () => {
    expect(getApiEnvironment()).toEqual({
      mode: "mock",
      baseUrl: "http://localhost:8000/api/v1",
    });
  });

  it("unwraps standardized successful API responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({
          data: { id: "patient_001" },
          meta: { requestId: "req_001" },
        }),
      ),
    );

    await expect(apiClient.get<{ id: string }>("/patients/patient_001")).resolves.toEqual({
      id: "patient_001",
    });
  });

  it("throws a normalized API error for unsuccessful API responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json(
          {
            error: {
              code: "FORBIDDEN",
              message: "Role cannot access this resource.",
              status: 403,
            },
          },
          { status: 403 },
        ),
      ),
    );

    await expect(apiClient.get("/billing/bills")).rejects.toMatchObject({
      code: "FORBIDDEN",
      status: 403,
    });
  });
});
