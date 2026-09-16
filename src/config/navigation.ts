import {
  Activity,
  Bell,
  Bed,
  Droplets,
  FileText,
  HeartPulse,
  LayoutDashboard,
  Pill,
  ReceiptText,
  UserRound,
  type LucideIcon,
} from "lucide-react";

import type { UserRole } from "@/contracts/auth";
import { hasEveryPermission } from "@/lib/auth/rbac";

import type { Permission } from "./permissions";
import { ROUTES } from "./routes";

export type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  requiredPermissions: Permission[];
  group: "workspace" | "operations" | "account";
};

export const NAVIGATION_ITEMS: NavigationItem[] = [
  {
    label: "Dashboard",
    href: ROUTES.dashboard,
    icon: LayoutDashboard,
    requiredPermissions: [],
    group: "workspace",
  },
  {
    label: "Patients",
    href: ROUTES.patients.root,
    icon: Activity,
    requiredPermissions: ["patient.read"],
    group: "operations",
  },
  {
    label: "Wards",
    href: ROUTES.wards,
    icon: Bed,
    requiredPermissions: ["ward.read"],
    group: "operations",
  },
  {
    label: "Organ",
    href: ROUTES.organ.root,
    icon: HeartPulse,
    requiredPermissions: ["organ.match.read"],
    group: "operations",
  },
  {
    label: "Blood Bank",
    href: ROUTES.bloodBank.root,
    icon: Droplets,
    requiredPermissions: ["blood.inventory.read"],
    group: "operations",
  },
  {
    label: "Pharmacy",
    href: ROUTES.pharmacy.root,
    icon: Pill,
    requiredPermissions: ["prescription.read"],
    group: "operations",
  },
  {
    label: "Billing",
    href: ROUTES.billing.root,
    icon: ReceiptText,
    requiredPermissions: ["billing.read"],
    group: "operations",
  },
  {
    label: "Discharge",
    href: ROUTES.billing.discharge,
    icon: FileText,
    requiredPermissions: ["discharge.read"],
    group: "operations",
  },
  {
    label: "My Care",
    href: "/my-care",
    icon: HeartPulse,
    requiredPermissions: ["patient.read"], // Filtered further in getNavigationForRole
    group: "workspace",
  },
  {
    label: "Family Care",
    href: "/family-care",
    icon: HeartPulse,
    requiredPermissions: ["patient.read"], // Filtered further in getNavigationForRole
    group: "workspace",
  },
  {
    label: "Notifications",
    href: ROUTES.notifications,
    icon: Bell,
    requiredPermissions: ["notification.read"],
    group: "account",
  },
  {
    label: "Profile",
    href: ROUTES.profile,
    icon: UserRound,
    requiredPermissions: [],
    group: "account",
  },
];

export function getNavigationForRole(role: UserRole): NavigationItem[] {
  return NAVIGATION_ITEMS.filter((item) => {
    // Hide staff-specific routes from PATIENT and FAMILY_ATTENDANT
    if (role === "PATIENT" || role === "FAMILY_ATTENDANT") {
      if (item.group === "operations") return false;
    }
    
    // Role-specific workspace links
    if (item.label === "My Care" && role !== "PATIENT") return false;
    if (item.label === "Family Care" && role !== "FAMILY_ATTENDANT") return false;

    return hasEveryPermission(role, item.requiredPermissions);
  });
}

