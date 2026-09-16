import type { AuthSession } from "@/contracts/auth";

const SESSION_STORAGE_KEY = "caregrid_mock_session";

/**
 * STRICTLY FOR MOCK MODE.
 * This adapter uses sessionStorage to persist mock logins during local development
 * so that full page reloads do not instantly destroy the demo session.
 * 
 * REMOTE production backend MUST enforce authentication and authorization 
 * via secure HTTP-only cookies.
 */
export const mockSessionAdapter = {
  getSession(): AuthSession | null {
    try {
      const data = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (!data) return null;
      return JSON.parse(data) as AuthSession;
    } catch {
      return null;
    }
  },

  setSession(session: AuthSession): void {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch {
      // Ignore
    }
  },

  clearSession(): void {
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    } catch {
      // Ignore
    }
  },
};
