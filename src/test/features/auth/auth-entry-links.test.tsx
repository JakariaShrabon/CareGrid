import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import LoginPage from "@/app/(auth)/login/page";
import RegisterPage from "@/app/(auth)/register/page";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

vi.mock("@/features/auth/auth-provider", () => ({
  useAuth: () => ({
    register: vi.fn(),
    login: vi.fn(),
    session: null,
    isAuthenticated: false,
    isLoading: false,
  }),
}));

describe("auth entry page switching", () => {
  it("links from login to public registration", async () => {
    render(<LoginPage />);

    expect(await screen.findByRole("link", { name: "Create Account" })).toHaveAttribute(
      "href",
      "/register",
    );
  });

  it("links from registration back to login", () => {
    render(<RegisterPage />);

    expect(screen.getByRole("link", { name: "Sign In" })).toHaveAttribute(
      "href",
      "/login",
    );
  });
});
