"use client";

import { useAuth } from "./auth-provider";

export function useCurrentUser() {
  const { session, isAuthenticated, isLoading } = useAuth();
  
  return {
    user: session?.user ?? null,
    isAuthenticated,
    isLoading,
  };
}
