import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AppShell } from "@/components/layout/app-shell";
import { DEMO_USERS } from "@/mocks/data/demo-users";

vi.mock("next/navigation", () => ({
  usePathname: () => "/family-care",
  useRouter: () => ({
    push: vi.fn(),
  }),
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

vi.mock("@/features/auth/use-current-user", () => ({
  useCurrentUser: () => ({
    user: DEMO_USERS["family@caregrid.demo"],
  }),
}));

vi.mock("@/features/auth/auth-provider", () => ({
  useAuth: () => ({
    logout: vi.fn(),
  }),
}));

vi.mock("@/features/notifications/hooks/use-notifications", () => ({
  useNotifications: () => ({
    data: { data: { items: [] } },
  }),
}));

describe("AppShell layout", () => {
  it("keeps navigation separate while the main portal pane owns vertical scrolling", () => {
    render(
      <AppShell>
        <div>Family portal content</div>
      </AppShell>,
    );

    const shell = screen.getByTestId("app-shell");
    const contentPane = screen.getByRole("main");
    const sidebar = screen.getAllByLabelText("Primary navigation")[0].closest("aside");

    expect(shell).toHaveClass("h-[100dvh]");
    expect(shell).toHaveClass("overflow-hidden");
    expect(contentPane).toHaveClass("overflow-y-auto");
    expect(sidebar).toHaveClass("h-[100dvh]");
    expect(sidebar).toHaveClass("overflow-hidden");
  });
});
