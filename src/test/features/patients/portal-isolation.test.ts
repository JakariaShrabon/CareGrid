import { describe, it, expect, beforeAll, afterAll, afterEach } from "vitest";
import { setupServer } from "msw/node";
import { mockSessionAdapter } from "@/lib/api/mock-session";
import { patientHandlers } from "@/mocks/handlers/patients";
import { getApiEnvironment } from "@/lib/api/environment";
import { DEMO_USERS } from "@/mocks/data/demo-users";
import { getMockDatabase } from "@/mocks/database/store";

const apiBaseUrl = getApiEnvironment().baseUrl;
const server = setupServer(...patientHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterAll(() => server.close());
afterEach(() => {
  server.resetHandlers();
  mockSessionAdapter.clearSession();
});

describe("Portal Isolation Backend Scoping", () => {
  it("denies access to a different patient's updates for a PATIENT role", async () => {
    // Setup a patient session
    mockSessionAdapter.setSession({
      user: DEMO_USERS["patient@caregrid.demo"],
      authenticatedAt: new Date().toISOString(),
    });

    const differentPatientId = "p2";
    
    // Perform simulated fetch
    const response = await fetch(`${apiBaseUrl}/patients/${differentPatientId}/updates`);
    expect(response.status).toBe(403);
    const data = await response.json();
    expect(data.error.code).toBe("FORBIDDEN");
  });

  it("denies access to a different patient's updates for a FAMILY_ATTENDANT role", async () => {
    // Setup a family session
    mockSessionAdapter.setSession({
      user: DEMO_USERS["family@caregrid.demo"],
      authenticatedAt: new Date().toISOString(),
    });

    const differentPatientId = "p2";
    
    const response = await fetch(`${apiBaseUrl}/patients/${differentPatientId}/updates`);
    expect(response.status).toBe(403);
  });

  it("allows access to own patient's updates and filters by visibility='FAMILY'", async () => {
    mockSessionAdapter.setSession({
      user: DEMO_USERS["patient@caregrid.demo"],
      authenticatedAt: new Date().toISOString(),
    });

    const ownPatientId = "pat_001"; // From DEMO_USERS["patient@caregrid.demo"]
    
    // Inject mock data for p1
    const db = getMockDatabase();
    db.dailyUpdates.push(
      { id: "test1", patientId: ownPatientId, visibility: "STAFF", content: "Secret", authorUserId: "doctor", authorRole: "DOCTOR", createdAt: new Date().toISOString() },
      { id: "test2", patientId: ownPatientId, visibility: "FAMILY", content: "Public", authorUserId: "doctor", authorRole: "DOCTOR", createdAt: new Date().toISOString() }
    );

    const response = await fetch(`${apiBaseUrl}/patients/${ownPatientId}/updates`);
    expect(response.status).toBe(200);
    const result = await response.json();
    
    // Should only return the FAMILY one
    expect(result.data.length).toBeGreaterThan(0);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(result.data.every((u: any) => u.visibility === "FAMILY")).toBe(true);
  });
});
