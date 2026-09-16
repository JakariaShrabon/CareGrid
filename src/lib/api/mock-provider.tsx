"use client";

import { useEffect, type ReactNode } from "react";

import { getApiEnvironment } from "./environment";

export function MockProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (getApiEnvironment().mode !== "mock") {
      return;
    }

    void import("@/mocks/browser").then(({ worker }) => {
      void worker.start({
        onUnhandledRequest: "bypass",
      });
    });
  }, []);

  return children;
}
