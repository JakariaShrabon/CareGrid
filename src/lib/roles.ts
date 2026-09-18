import type { UserRole } from '@/types/auth'

/**
 * Rendering-only role affordances. These gate which buttons/sections a demo
 * user sees; they are NOT an authorization mechanism — real RBAC arrives
 * with the Spring Boot backend.
 */

export function isClinician(role?: UserRole): boolean {
  return role === 'doctor' || role === 'nurse'
}

/** Caregiving roles — anyone a patient or family member considers "staff". */
export function isCareStaff(role?: UserRole): boolean {
  return isClinician(role)
}

/** Patient/family account — sees the simplified family portal, never staff controls. */
export function isPatientFamily(role?: UserRole): boolean {
  return role === 'patient_family'
}

/** Blood bank coordinator role — inventory, requests and SOS workflows. */
export function isBloodBankCoordinator(role?: UserRole): boolean {
  return role === 'blood_bank_coordinator'
}

/** Pharmacist role — dispensing and inventory management. */
export function isPharmacist(role?: UserRole): boolean {
  return role === 'pharmacist'
}