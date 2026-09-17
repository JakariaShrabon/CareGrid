import type { UserRole } from '@/types/auth'

/**
 * Rendering-only role affordances. These gate which buttons/sections a demo
 * user sees; they are NOT an authorization mechanism — real RBAC arrives
 * with the Spring Boot backend.
 */

export function isClinician(role?: UserRole): boolean {
  return role === 'doctor' || role === 'nurse'
}

export function isCareStaff(role?: UserRole): boolean {
  return isClinician(role)
}