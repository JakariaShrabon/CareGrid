import { Suspense } from 'react'
import type { RouteObject } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import { RequireAuth } from '@/routes/guards'
import { AppLayout } from '@/layouts/app-layout'
import {
  DashboardPage,
  ModulePlaceholderPage,
  NotificationsPage,
  PageLoader,
  PatientDetailPage,
  PatientListPage,
  VitalsHistoryPage,
  VitalsPage,
  WardsPage,
} from '@/routes/app-lazy'

/**
 * Authenticated application routes. `/app` indexes to `/app/dashboard`.
 * Clinical routes (Phase 6) are live; every other module route falls through
 * to a clean placeholder so the sidebar never produces broken links. Pages
 * are lazy-loaded to keep the initial bundle small.
 */
export const appRoutes: RouteObject[] = [
  {
    path: '/app',
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/app/dashboard" replace /> },
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<PageLoader />}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'patients',
        element: (
          <Suspense fallback={<PageLoader />}>
            <PatientListPage />
          </Suspense>
        ),
      },
      {
        path: 'patients/:patientId',
        element: (
          <Suspense fallback={<PageLoader />}>
            <PatientDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'vitals',
        element: (
          <Suspense fallback={<PageLoader />}>
            <VitalsPage />
          </Suspense>
        ),
      },
      {
        path: 'vitals/:patientId',
        element: (
          <Suspense fallback={<PageLoader />}>
            <VitalsHistoryPage />
          </Suspense>
        ),
      },
      {
        path: 'wards',
        element: (
          <Suspense fallback={<PageLoader />}>
            <WardsPage />
          </Suspense>
        ),
      },
      {
        path: 'notifications',
        element: (
          <Suspense fallback={<PageLoader />}>
            <NotificationsPage />
          </Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ModulePlaceholderPage />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<PageLoader />}>
            <ModulePlaceholderPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <RequireAuth>
        <Navigate to="/app/dashboard" replace />
      </RequireAuth>
    ),
  },
]