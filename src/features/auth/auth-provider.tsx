"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import type { AuthSession, LoginCredentials, RegisterAccountRequest } from "@/contracts/auth";
import { authService } from "@/lib/auth/auth-service";

type AuthContextValue = {
  session: AuthSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthSession>;
  register: (request: RegisterAccountRequest) => Promise<AuthSession>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function hydrate() {
      try {
        const activeSession = await authService.getSession();
        if (mounted) {
          setSession(activeSession);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void hydrate();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (credentials: LoginCredentials) => {
    const newSession = await authService.login(credentials);
    setSession(newSession);
    return newSession;
  };

  const register = async (request: RegisterAccountRequest) => {
    const newSession = await authService.register(request);
    setSession(newSession);
    return newSession;
  };

  const logout = async () => {
    await authService.logout();
    setSession(null);
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        isAuthenticated: !!session,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
