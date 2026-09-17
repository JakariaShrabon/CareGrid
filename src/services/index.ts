/**
 * Service abstraction layer.
 *
 * Every feature reads/writes data through a service here. Services expose
 * REST-style methods (list / get / create / update / delete) and currently
 * resolve from realistic mock data. The Spring Boot swap-in only replaces the
 * implementation of each method with an HTTP client — the interface stays.
 *
 * Auth: the UI talks to `authService` below. Today it is bound to the demo
 * mock implementation (`@/services/mock/mock-auth`); swapping it for a Spring
 * Boot REST client is a one-line change.
 *
 * Dashboard: the dashboard reads through `dashboardService`, currently bound
 * to `mockDashboardService`. Pages consume it through React Query so the
 * future architecture becomes UI → service → React Query → Spring Boot REST.
 *
 * Clinical (Phase 6): patients, vitals and wards all expose REST-style
 * contracts and bind to mock implementations today. Mutations keep the mock
 * in memory and the UI invalidates React Query keys afterwards, matching how
 * the Spring Boot REST clients will behave.
 */
export { ServiceError } from '@/services/service-error'
export {
  AuthServiceError,
  isAuthServiceError,
} from '@/services/auth'
export type { AuthService, AuthErrorCode } from '@/services/auth'
export type {
  DashboardService,
  DashboardOverview,
  AppNotification,
  ActivityEvent,
  NotificationCategory,
} from '@/services/dashboard'
export type { PatientService } from '@/services/patients'
export type { VitalsService } from '@/services/vitals'
export type { WardService, WardSummary } from '@/services/wards'

import { mockAuthService } from '@/services/mock/mock-auth'
import type { AuthService } from '@/services/auth'
import { mockDashboardService } from '@/services/mock/mock-dashboard'
import type { DashboardService } from '@/services/dashboard'
import { mockPatientService } from '@/services/mock/mock-patient-service'
import type { PatientService } from '@/services/patients'
import { mockVitalsService } from '@/services/mock/mock-vitals-service'
import type { VitalsService } from '@/services/vitals'
import { mockWardService } from '@/services/mock/mock-ward-service'
import type { WardService } from '@/services/wards'

export const authService: AuthService = mockAuthService

export const dashboardService: DashboardService = mockDashboardService

export const patientService: PatientService = mockPatientService

export const vitalsService: VitalsService = mockVitalsService

export const wardService: WardService = mockWardService