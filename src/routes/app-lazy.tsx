import { lazy } from 'react'
import { LoadingState } from '@/components/common/loading-state'

/**
 * Lazy route components for the authenticated section. Kept in their own
 * file so the route config stays clean and each page is code-split.
 */
export const DashboardPage = lazy(() =>
  import('@/pages/app/dashboard-page').then((module) => ({
    default: module.DashboardPage,
  })),
)
export const NotificationsPage = lazy(() =>
  import('@/pages/app/notifications-page').then((module) => ({
    default: module.NotificationsPage,
  })),
)
export const ModulePlaceholderPage = lazy(() =>
  import('@/pages/app/module-placeholder-page').then((module) => ({
    default: module.ModulePlaceholderPage,
  })),
)
export const PatientListPage = lazy(() =>
  import('@/pages/app/patients-page').then((module) => ({
    default: module.PatientListPage,
  })),
)
export const PatientDetailPage = lazy(() =>
  import('@/pages/app/patient-detail-page').then((module) => ({
    default: module.PatientDetailPage,
  })),
)
export const VitalsPage = lazy(() =>
  import('@/pages/app/vitals-page').then((module) => ({
    default: module.VitalsPage,
  })),
)
export const VitalsHistoryPage = lazy(() =>
  import('@/pages/app/vitals-history-page').then((module) => ({
    default: module.VitalsHistoryPage,
  })),
)
export const WardsPage = lazy(() =>
  import('@/pages/app/wards-page').then((module) => ({
    default: module.WardsPage,
  })),
)

export function PageLoader() {
  return (
    <div className="mx-auto w-full max-w-[90rem] px-4 py-6 sm:px-6 lg:px-8">
      <LoadingState rows={8} />
    </div>
  )
}