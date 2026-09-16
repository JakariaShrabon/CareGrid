import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HttpResponse, http } from "msw";
import { setupServer } from "msw/node";
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest";

import { RegisterForm } from "@/features/auth/components/register-form";
import { authService } from "@/lib/auth/auth-service";
import { mockSessionAdapter } from "@/lib/api/mock-session";
import { getApiEnvironment } from "@/lib/api/environment";
import { handlers, resetRegisteredMockUsers } from "@/mocks/handlers";

const server = setupServer(...handlers);
const baseUrl = getApiEnvironment().baseUrl;

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  server.resetHandlers();
  resetRegisteredMockUsers();
  window.sessionStorage.clear();
});
afterAll(() => server.close());

describe("CareGrid public registration", () => {
  it("registers a Patient account, starts a session, and does not link a patient record", async () => {
    const session = await authService.register({
      name: "New Patient",
      email: "new.patient@caregrid.demo",
      password: "CareGrid123!",
      role: "PATIENT",
    });

    expect(session.user).toMatchObject({
      name: "New Patient",
      email: "new.patient@caregrid.demo",
      role: "PATIENT",
    });
    expect(session.user.patientId).toBeUndefined();
    expect(mockSessionAdapter.getSession()?.user.email).toBe("new.patient@caregrid.demo");
  });

  it("registers a Family Attendant account without linking an arbitrary patient", async () => {
    const session = await authService.register({
      name: "Family Member",
      email: "family.member@caregrid.demo",
      password: "CareGrid123!",
      role: "FAMILY_ATTENDANT",
    });

    expect(session.user.role).toBe("FAMILY_ATTENDANT");
    expect(session.user.patientId).toBeUndefined();
  });

  it("rejects duplicate registration emails with a normalized message", async () => {
    await authService.register({
      name: "First Account",
      email: "duplicate@caregrid.demo",
      password: "CareGrid123!",
      role: "PATIENT",
    });

    await expect(
      authService.register({
        name: "Second Account",
        email: "duplicate@caregrid.demo",
        password: "CareGrid123!",
        role: "PATIENT",
      }),
    ).rejects.toThrow("An account with this email already exists.");
  });

  it("rejects staff roles even if a request is tampered with", async () => {
    const response = await fetch(`${baseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Staff Attempt",
        email: "staff.attempt@caregrid.demo",
        password: "CareGrid123!",
        role: "DOCTOR",
      }),
    });

    expect(response.status).toBe(403);
    const payload = (await response.json()) as { error: { message: string } };
    expect(payload.error.message).toBe("Public registration is limited to patient and family accounts.");
  });

  it("keeps existing demo users able to sign in", async () => {
    const session = await authService.login({
      identifier: "doctor@caregrid.demo",
      password: "CareGrid123!",
    });

    expect(session.user.role).toBe("DOCTOR");
  });

  it("validates email and password confirmation before submitting", async () => {
    const user = userEvent.setup();
    const onRegistered = vi.fn();
    render(<RegisterForm onRegistered={onRegistered} />);

    await user.type(screen.getByLabelText("Full Name"), "New Patient");
    await user.type(screen.getByLabelText("Email"), "not-an-email");
    await user.type(screen.getByLabelText("Password"), "CareGrid123!");
    await user.type(screen.getByLabelText("Confirm Password"), "Different123!");
    await user.click(screen.getByLabelText(/agree to the demo/i));
    await user.click(screen.getByRole("button", { name: "Create Account" }));

    expect(await screen.findByText("Please enter a valid email address")).toBeInTheDocument();
    expect(screen.getByText("Passwords must match")).toBeInTheDocument();
    expect(onRegistered).not.toHaveBeenCalled();
  });

  it("submits only Patient or Family Attendant account types from the form", async () => {
    const user = userEvent.setup();
    const onRegistered = vi.fn();
    let capturedRole: unknown;
    server.use(
      http.post(`${baseUrl}/auth/register`, async ({ request }) => {
        const body = (await request.json()) as { role?: unknown };
        capturedRole = body.role;
        return HttpResponse.json({
          data: {
            user: {
              id: "usr_registered_test",
              name: "New Patient",
              email: "new.patient.form@caregrid.demo",
              role: "PATIENT",
              createdAt: "2026-09-13T00:00:00.000Z",
            },
          },
        });
      }),
    );

    render(<RegisterForm onRegistered={onRegistered} />);

    await user.type(screen.getByLabelText("Full Name"), "New Patient");
    await user.type(screen.getByLabelText("Email"), "new.patient.form@caregrid.demo");
    await user.type(screen.getByLabelText("Password"), "CareGrid123!");
    await user.type(screen.getByLabelText("Confirm Password"), "CareGrid123!");
    await user.click(screen.getByLabelText(/agree to the demo/i));
    await user.click(screen.getByRole("button", { name: "Create Account" }));

    await waitFor(() => expect(onRegistered).toHaveBeenCalled());
    expect(capturedRole).toBe("PATIENT");
    expect(screen.queryByText("Doctor")).not.toBeInTheDocument();
    expect(screen.queryByText("Admin")).not.toBeInTheDocument();
  });
});
