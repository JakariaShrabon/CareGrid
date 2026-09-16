import { getApiEnvironment } from "@/lib/api/environment";
import type { AuthSession, LoginCredentials, RegisterAccountRequest } from "@/contracts/auth";
import { mockSessionAdapter } from "@/lib/api/mock-session";

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    const apiBaseUrl = getApiEnvironment().baseUrl;
    const isMock = getApiEnvironment().mode === "mock";

    const response = await fetch(`${apiBaseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error?.message || "Failed to login.");
    }

    const { data } = await response.json();
    const session: AuthSession = {
      user: data.user,
      authenticatedAt: new Date().toISOString(),
    };

    if (isMock) {
      mockSessionAdapter.setSession(session);
    }

    return session;
  },

  async register(request: RegisterAccountRequest): Promise<AuthSession> {
    const apiBaseUrl = getApiEnvironment().baseUrl;
    const isMock = getApiEnvironment().mode === "mock";

    const response = await fetch(`${apiBaseUrl}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.error?.message || "Failed to create account.");
    }

    const { data } = await response.json();
    const session: AuthSession = {
      user: data.user,
      authenticatedAt: new Date().toISOString(),
    };

    if (isMock) {
      mockSessionAdapter.setSession(session);
    }

    return session;
  },

  async getSession(): Promise<AuthSession | null> {
    const apiBaseUrl = getApiEnvironment().baseUrl;
    const isMock = getApiEnvironment().mode === "mock";

    if (isMock) {
      // In mock mode, short-circuit to sessionStorage adapter to survive reloads
      return mockSessionAdapter.getSession();
    }

    try {
      const response = await fetch(`${apiBaseUrl}/auth/session`);
      if (!response.ok) return null;
      const { data } = await response.json();
      return data;
    } catch {
      return null;
    }
  },

  async logout(): Promise<void> {
    const apiBaseUrl = getApiEnvironment().baseUrl;
    const isMock = getApiEnvironment().mode === "mock";

    await fetch(`${apiBaseUrl}/auth/logout`, { method: "POST" }).catch(() => {});

    if (isMock) {
      mockSessionAdapter.clearSession();
    }
  },

  async requestPasswordReset(identifier: string): Promise<void> {
    const apiBaseUrl = getApiEnvironment().baseUrl;
    await fetch(`${apiBaseUrl}/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier }),
    });
  },
};
