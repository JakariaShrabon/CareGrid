import { describe, it, expect, beforeEach, beforeAll, afterAll, afterEach } from "vitest";
import { setupServer } from "msw/node";
import { handlers } from "@/mocks/handlers";
import { getApiEnvironment } from "@/lib/api/environment";
import { resetMockDatabase } from "@/mocks/database/store";

const server = setupServer(...handlers);
const baseUrl = getApiEnvironment().baseUrl;

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

describe("MSW Handlers", () => {
  beforeEach(() => {
    resetMockDatabase(new Date("2026-09-12T00:00:00Z"));
  });

  it("handles patient list pagination and search", async () => {
    const res = await fetch(`${baseUrl}/patients?search=PatientFirst1 Last1`);
    expect(res.status).toBe(200);
    const payload = await res.json() as { data: { items: { displayName: string }[] } };
    expect(payload.data.items).toHaveLength(1);
    expect(payload.data.items[0].displayName).toBe("PatientFirst1 Last1");
  });

  it("handles vitals creation", async () => {
    const res = await fetch(`${baseUrl}/patients/p1/vitals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ temperatureCelsius: 38.5 })
    });
    expect(res.status).toBe(200);
    const payload = await res.json() as { data: Record<string, unknown> };
    expect(payload.data.temperatureCelsius).toBe(38.5);
  });

  it("handles bed status update", async () => {
    const res = await fetch(`${baseUrl}/beds/w1_r1_b1/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CLEANING" })
    });
    expect(res.status).toBe(200);
    const payload = await res.json() as { data: Record<string, unknown> };
    expect(payload.data.status).toBe("CLEANING");
  });

  it("handles creating an SOS request", async () => {
    const res = await fetch(`${baseUrl}/blood/sos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hospitalId: "h1", bloodGroup: "AB+", component: "PLASMA", requiredUnits: 2 })
    });
    expect(res.status).toBe(200);
    const payload = await res.json() as { data: Record<string, unknown> };
    expect(payload.data.bloodGroup).toBe("AB+");
  });
});
