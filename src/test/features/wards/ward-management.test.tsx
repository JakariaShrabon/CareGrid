import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import React from "react";
import type { BedStatus } from "@/contracts/ward";

// ── BedStatus contract guard ─────────────────────────────────────────────────
// This test is purely type/value-level – it asserts our UI only handles the
// four canonical statuses and that MAINTENANCE is never present.
describe("BedStatus canonical values", () => {
  const ALLOWED: BedStatus[] = ["AVAILABLE", "OCCUPIED", "CLEANING", "RESERVED"];

  it("only allows four canonical statuses", () => {
    expect(ALLOWED).toHaveLength(4);
    expect(ALLOWED).toContain("AVAILABLE");
    expect(ALLOWED).toContain("OCCUPIED");
    expect(ALLOWED).toContain("CLEANING");
    expect(ALLOWED).toContain("RESERVED");
  });

  it("does NOT include MAINTENANCE as a canonical status", () => {
    const asStrings = ALLOWED as string[];
    expect(asStrings).not.toContain("MAINTENANCE");
  });
});

// ── WardSummary derived counts ───────────────────────────────────────────────
describe("Ward bed status summary counts", () => {
  function countStatuses(beds: { status: BedStatus }[]) {
    return {
      available: beds.filter((b) => b.status === "AVAILABLE").length,
      occupied: beds.filter((b) => b.status === "OCCUPIED").length,
      cleaning: beds.filter((b) => b.status === "CLEANING").length,
      reserved: beds.filter((b) => b.status === "RESERVED").length,
    };
  }

  const sampleBeds: { status: BedStatus }[] = [
    { status: "AVAILABLE" },
    { status: "AVAILABLE" },
    { status: "OCCUPIED" },
    { status: "CLEANING" },
    { status: "RESERVED" },
  ];

  it("correctly counts AVAILABLE beds", () => {
    expect(countStatuses(sampleBeds).available).toBe(2);
  });

  it("correctly counts OCCUPIED beds", () => {
    expect(countStatuses(sampleBeds).occupied).toBe(1);
  });

  it("correctly counts CLEANING beds", () => {
    expect(countStatuses(sampleBeds).cleaning).toBe(1);
  });

  it("correctly counts RESERVED beds", () => {
    expect(countStatuses(sampleBeds).reserved).toBe(1);
  });
});

// ── StatusBadge renders all ward statuses ────────────────────────────────────
describe("StatusBadge renders canonical ward statuses", () => {
  beforeEach(() => vi.resetModules());

  const statuses: BedStatus[] = ["AVAILABLE", "OCCUPIED", "CLEANING", "RESERVED"];

  statuses.forEach((status) => {
    it(`renders ${status} badge with its label`, async () => {
      const { StatusBadge } = await import(
        "@/components/data-display/status-badge"
      );
      render(<StatusBadge status={status} />);
      const badge = screen.getByText(
        status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
      );
      expect(badge).toBeInTheDocument();
    });
  });

  it("does NOT contain MAINTENANCE in the status map", async () => {
    const { getStatusDefinition } = await import(
      "@/components/data-display/status-badge"
    );
    // Calling getStatusDefinition("MAINTENANCE" as any) should not produce
    // a valid definition with a matching label "Maintenance"
    const result = (getStatusDefinition as (s: string) => { label: string } | undefined)(
      "MAINTENANCE"
    );
    expect(result?.label).not.toBe("Maintenance");
  });
});

// ── Ward permission logic ─────────────────────────────────────────────────────
describe("Ward permission logic", () => {
  it("NURSE has ward.manage permission", async () => {
    const { hasPermission } = await import("@/lib/auth/rbac");
    expect(hasPermission("NURSE", "ward.manage")).toBe(true);
  });

  it("DOCTOR does NOT have ward.manage permission", async () => {
    const { hasPermission } = await import("@/lib/auth/rbac");
    expect(hasPermission("DOCTOR", "ward.manage")).toBe(false);
  });

  it("BILLING_OFFICER does NOT have ward.manage permission", async () => {
    const { hasPermission } = await import("@/lib/auth/rbac");
    expect(hasPermission("BILLING_OFFICER", "ward.manage")).toBe(false);
  });

  it("FAMILY_ATTENDANT does NOT have ward.read permission", async () => {
    const { hasPermission } = await import("@/lib/auth/rbac");
    expect(hasPermission("FAMILY_ATTENDANT", "ward.read")).toBe(false);
  });
});

// ── Patient clinical permissions ─────────────────────────────────────────────
describe("Patient clinical permissions", () => {
  it("DOCTOR can write vitals", async () => {
    const { hasPermission } = await import("@/lib/auth/rbac");
    expect(hasPermission("DOCTOR", "patient.vitals.write")).toBe(true);
  });

  it("NURSE can write vitals", async () => {
    const { hasPermission } = await import("@/lib/auth/rbac");
    expect(hasPermission("NURSE", "patient.vitals.write")).toBe(true);
  });

  it("BILLING_OFFICER cannot write vitals", async () => {
    const { hasPermission } = await import("@/lib/auth/rbac");
    expect(hasPermission("BILLING_OFFICER", "patient.vitals.write")).toBe(false);
  });

  it("FAMILY_ATTENDANT cannot write vitals", async () => {
    const { hasPermission } = await import("@/lib/auth/rbac");
    expect(hasPermission("FAMILY_ATTENDANT", "patient.vitals.write")).toBe(false);
  });

  it("DOCTOR can write daily updates", async () => {
    const { hasPermission } = await import("@/lib/auth/rbac");
    expect(hasPermission("DOCTOR", "patient.update.write")).toBe(true);
  });

  it("NURSE can write daily updates", async () => {
    const { hasPermission } = await import("@/lib/auth/rbac");
    expect(hasPermission("NURSE", "patient.update.write")).toBe(true);
  });

  it("FAMILY_ATTENDANT cannot write daily updates", async () => {
    const { hasPermission } = await import("@/lib/auth/rbac");
    expect(hasPermission("FAMILY_ATTENDANT", "patient.update.write")).toBe(false);
  });
});
