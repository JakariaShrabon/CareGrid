import { http, HttpResponse } from "msw";

import { getApiEnvironment } from "@/lib/api/environment";
import { DEMO_USERS } from "@/mocks/data/demo-users";
import type { AuthUser, PublicRegistrationRole } from "@/contracts/auth";

import { patientHandlers } from "./patients";
import { wardHandlers } from "./wards";
import { organHandlers } from "./organ";
import { bloodHandlers } from "./blood";
import { pharmacyHandlers } from "./pharmacy";
import { billingHandlers } from "./billing";
import { notificationHandlers } from "./notifications";

const apiBaseUrl = getApiEnvironment().baseUrl;
const publicRegistrationRoles: PublicRegistrationRole[] = ["PATIENT", "FAMILY_ATTENDANT"];

const registeredUsers = new Map<string, AuthUser>();
const registeredPasswords = new Map<string, string>();

export function resetRegisteredMockUsers() {
  registeredUsers.clear();
  registeredPasswords.clear();
}

export const handlers = [
  // AUTH
  http.post(`${apiBaseUrl}/auth/login`, async ({ request }) => {
    const body = await request.json() as { identifier?: string; password?: string };

    const identifier = body.identifier?.toLowerCase() ?? "";
    const registeredUser = registeredUsers.get(identifier);

    if (registeredUser) {
      if (registeredPasswords.get(identifier) !== body.password) {
        return HttpResponse.json(
          { error: { message: "Invalid credentials. Please use the demo password." } },
          { status: 401 }
        );
      }

      return HttpResponse.json({ data: { user: registeredUser } });
    }

    if (body.password !== "CareGrid123!") {
      return HttpResponse.json(
        { error: { message: "Invalid credentials. Please use the demo password." } },
        { status: 401 }
      );
    }

    const user = DEMO_USERS[identifier];
    if (!user) {
      return HttpResponse.json(
        { error: { message: "Account not found." } },
        { status: 401 }
      );
    }

    return HttpResponse.json({ data: { user } });
  }),

  http.post(`${apiBaseUrl}/auth/register`, async ({ request }) => {
    const body = await request.json() as {
      name?: string;
      email?: string;
      password?: string;
      role?: string;
    };
    const email = body.email?.trim().toLowerCase() ?? "";
    const role = body.role;

    // Mock/demo boundary: public registration is only for patient/family access.
    // Production must enforce hashing, uniqueness, rate limits, session cookies,
    // verification policy, and hospital-provisioned staff invitations server-side.
    if (!publicRegistrationRoles.includes(role as PublicRegistrationRole)) {
      return HttpResponse.json(
        { error: { message: "Public registration is limited to patient and family accounts." } },
        { status: 403 }
      );
    }

    if (!body.name?.trim() || !email || !body.password) {
      return HttpResponse.json(
        { error: { message: "Name, email, password, and account type are required." } },
        { status: 400 }
      );
    }

    if (DEMO_USERS[email] || registeredUsers.has(email)) {
      return HttpResponse.json(
        { error: { message: "An account with this email already exists." } },
        { status: 409 }
      );
    }

    const user: AuthUser = {
      id: `usr_registered_${Date.now()}`,
      name: body.name.trim(),
      email,
      role: role as PublicRegistrationRole,
      createdAt: new Date().toISOString(),
    };

    registeredUsers.set(email, user);
    registeredPasswords.set(email, body.password);

    return HttpResponse.json({ data: { user } });
  }),

  http.get(`${apiBaseUrl}/auth/session`, () => {
    // Session fetching behavior is handled purely via the adapter in the frontend mock service
    // for simplicity during frontend development. The real backend will use cookies.
    return HttpResponse.json({ data: null }, { status: 401 });
  }),

  http.post(`${apiBaseUrl}/auth/logout`, () => {
    return HttpResponse.json({ success: true });
  }),

  http.post(`${apiBaseUrl}/auth/forgot-password`, () => {
    return HttpResponse.json({ success: true });
  }),

  http.post(`${apiBaseUrl}/auth/reset-password`, () => {
    return HttpResponse.json({ success: true });
  }),

  // DOMAINS
  ...patientHandlers,
  ...wardHandlers,
  ...organHandlers,
  ...bloodHandlers,
  ...pharmacyHandlers,
  ...billingHandlers,
  ...notificationHandlers,
];
