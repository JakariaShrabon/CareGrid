import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import PublicHomePage from "@/app/(public)/page";

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

describe("public landing page", () => {
  it("presents a single-screen medical landing page with neutral auth entry points", () => {
    const { container } = render(<PublicHomePage />);
    const shell = container.firstElementChild;

    expect(shell).toHaveClass("min-h-[100dvh]");
    expect(shell).toHaveClass("overflow-x-hidden");

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Hospital operations, centered on patient care.",
      }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Open Dashboard" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sign In to CareGrid" })).toHaveAttribute(
      "href",
      "/login",
    );
    expect(screen.getByRole("link", { name: "Sign In" })).toHaveAttribute("href", "/login");
    expect(screen.getAllByRole("link", { name: "Create Account" })).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ href: expect.stringContaining("/register") }),
      ]),
    );

    expect(screen.getByText("Role-based access")).toBeInTheDocument();
    expect(screen.getByText("Coordinated workflows")).toBeInTheDocument();
    expect(screen.getByText("Patient-centered context")).toBeInTheDocument();
    expect(screen.getByText("Connected hospital care")).toBeInTheDocument();

    for (const unsupportedClaim of [
      "HIPAA compliant",
      "trusted by",
      "99.9% uptime",
      "clinically certified",
      "Secure hospital operations",
    ]) {
      expect(screen.queryByText(unsupportedClaim, { exact: false })).not.toBeInTheDocument();
    }

    for (const removedCopy of [
      "Patient Overview",
      "Organ Match",
      "Blood Inventory",
      "Prescription Queue",
      "John M.",
      "Vitals Updated",
      "37.2 C",
      "118/76",
      "98%",
      "89%",
      "O- Low",
      "3 Pending",
    ]) {
      expect(screen.queryByText(removedCopy)).not.toBeInTheDocument();
    }
  });
});
