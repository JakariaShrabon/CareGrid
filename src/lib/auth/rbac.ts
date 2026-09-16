import type { UserRole } from "@/contracts/auth";
import { ROLE_PERMISSIONS, type Permission } from "@/config/permissions";
import { ROUTE_ACCESS_RULES } from "@/config/routes";

export type { Permission };

export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function hasEveryPermission(
  role: UserRole,
  permissions: readonly Permission[],
): boolean {
  return permissions.every((permission) => hasPermission(role, permission));
}

export function hasAnyPermission(
  role: UserRole,
  permissions: readonly Permission[],
): boolean {
  return permissions.length === 0 || permissions.some((permission) => hasPermission(role, permission));
}

export function canAccessRoute(role: UserRole, pathname: string): boolean {
  const matchingRule = [...ROUTE_ACCESS_RULES]
    .sort((a, b) => b.pattern.length - a.pattern.length)
    .find((rule) => pathname === rule.pattern || pathname.startsWith(`${rule.pattern}/`));

  if (!matchingRule) {
    return false;
  }

  return hasAnyPermission(role, matchingRule.requiredPermissions);
}
