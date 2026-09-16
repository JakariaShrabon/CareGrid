import { describe, expect, it } from "vitest";

import { getNavigationForRole } from "@/config/navigation";
import { ROUTES } from "@/config/routes";
import {
  canAccessRoute,
  hasPermission,
  type Permission,
} from "@/lib/auth/rbac";

describe("CareGrid RBAC foundation", () => {
  it("grants doctors clinical read and prescription creation without billing management", () => {
    expect(hasPermission("DOCTOR", "patient.read")).toBe(true);
    expect(hasPermission("DOCTOR", "prescription.create")).toBe(true);
    expect(hasPermission("DOCTOR", "billing.manage")).toBe(false);
  });

  it("keeps family attendants read-only for patient updates", () => {
    expect(hasPermission("FAMILY_ATTENDANT", "patient.read")).toBe(true);
    expect(hasPermission("FAMILY_ATTENDANT", "patient.update.write")).toBe(false);
    expect(hasPermission("FAMILY_ATTENDANT", "ward.manage")).toBe(false);
  });

  it("maps protected routes to permissions without role-specific duplication", () => {
    expect(canAccessRoute("BLOOD_BANK_COORDINATOR", ROUTES.bloodBank.root)).toBe(true);
    expect(canAccessRoute("PHARMACIST", ROUTES.bloodBank.root)).toBe(false);
    expect(canAccessRoute("BILLING_OFFICER", ROUTES.billing.claims)).toBe(true);
  });

  it("hides navigation items when a role lacks every required permission", () => {
    const familyNavigation = getNavigationForRole("FAMILY_ATTENDANT");
    const permissions = familyNavigation.flatMap((item) => item.requiredPermissions);

    expect(permissions).toContain("patient.read" satisfies Permission);
    expect(familyNavigation.some((item) => item.href.startsWith("/pharmacy"))).toBe(false);
  });
});
