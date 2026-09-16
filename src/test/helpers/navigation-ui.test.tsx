import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { getNavigationForRole } from "@/config/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { demoUser } from "@/features/auth/session";

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    className,
    onClick,
    "aria-current": ariaCurrent,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
    onClick?: () => void;
    "aria-current"?: "page" | "step" | "location" | "date" | "time" | "true" | "false" | boolean;
  }) => (
    <a href={href} className={className} onClick={onClick} aria-current={ariaCurrent}>
      {children}
    </a>
  ),
}));

describe("CareGrid navigation UI", () => {
  it("marks the active sidebar item with aria-current", () => {
    render(
      <Sidebar
        items={getNavigationForRole("DOCTOR")}
        user={demoUser}
        variant="desktop"
      />,
    );

    expect(screen.getByRole("link", { name: /dashboard/i })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
