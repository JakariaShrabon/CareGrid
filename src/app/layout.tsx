import type { Metadata } from "next";
import type { ReactNode } from "react";

import { MockProvider } from "@/lib/api/mock-provider";
import { QueryProvider } from "@/lib/query/query-provider";
import { AuthProvider } from "@/features/auth/auth-provider";

import "./globals.css";

export const metadata: Metadata = {
  title: "CareGrid.io",
  description: "Role-based hospital care coordination platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <MockProvider>
          <QueryProvider>
            <AuthProvider>{children}</AuthProvider>
          </QueryProvider>
        </MockProvider>
      </body>
    </html>
  );
}
