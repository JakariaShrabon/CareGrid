import { Suspense } from 'react'
import type { RouteObject } from 'react-router-dom'
import { Navigate } from 'react-router-dom'
import { RequireAuth } from '@/routes/guards'
import { AppLayout } from '@/layouts/app-layout'
import {
  BloodDonorsPage,
  BloodInventoryPage,
  BloodRequestsPage,
  BloodSosPage,
  DashboardPage,
  FamilyPortalPage,
  ModulePlaceholderPage,
  NotificationsPage,
  OrganDonorsPage,
  OrganIschemiaPage,
  OrganMatchingPage,
  OrganWaitingListPage,
  PageLoader,
  PatientDetailPage,
  PatientListPage,
  PharmacyAlertsPage,
  PharmacyInventoryPage,
  PharmacyPrescriptionDetailPage,
  PharmacyPrescriptionsPage,
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
        path: 'family',
        element: (
          <Suspense fallback={<PageLoader />}>
            <FamilyPortalPage />
          </Suspense>
        ),
      },
      {
        path: 'organ',
        element: <Navigate to="/app/organ/matching" replace />,
      },
      {
        path: 'organ/matching',
        element: (
          <Suspense fallback={<PageLoader />}>
            <OrganMatchingPage />
          </Suspense>
        ),
      },
      {
        path: 'organ/waiting-list',
        element: (
          <Suspense fallback={<PageLoader />}>
            <OrganWaitingListPage />
          </Suspense>
        ),
      },
      {
        path: 'organ/ischemia',
        element: (
          <Suspense fallback={<PageLoader />}>
            <OrganIschemiaPage />
          </Suspense>
        ),
      },
      {
        path: 'organ/donors',
        element: (
          <Suspense fallback={<PageLoader />}>
            <OrganDonorsPage />
          </Suspense>
        ),
      },
      {
        path: 'organ/living-donors',
        element: (
          <Suspense fallback={<PageLoader />}>
            <OrganDonorsPage />
          </Suspense>
        ),
      },
      {
        path: 'blood',
        element: <Navigate to="/app/blood/inventory" replace />,
      },
      {
        path: 'blood/inventory',
        element: (
          <Suspense fallback={<PageLoader />}>
            <BloodInventoryPage />
          </Suspense>
        ),
      },
      {
        path: 'blood/donors',
        element: (
          <Suspense fallback={<PageLoader />}>
            <BloodDonorsPage />
          </Suspense>
        ),
      },
      {
        path: 'blood/requests',
        element: (
          <Suspense fallback={<PageLoader />}>
            <BloodRequestsPage />
          </Suspense>
        ),
      },
      {
        path: 'blood/sos',
        element: (
          <Suspense fallback={<PageLoader />}>
            <BloodSosPage />
          </Suspense>
        ),
      },
      {
        path: 'pharmacy',
        element: <Navigate to="/app/pharmacy/prescriptions" replace />,
      },
      {
        path: 'pharmacy/prescriptions',
        element: (
          <Suspense fallback={<PageLoader />}>
            <PharmacyPrescriptionsPage />
          </Suspense>
        ),
      },
      {
        path: 'pharmacy/prescriptions/:prescriptionId',
        element: (
          <Suspense fallback={<PageLoader />}>
            <PharmacyPrescriptionDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'pharmacy/inventory',
        element: (
          <Suspense fallback={<PageLoader />}>
            <PharmacyInventoryPage />
          </Suspense>
        ),
      },
      {
        path: 'pharmacy/alerts',
        element: (
          <Suspense fallback={<PageLoader />}>
            <PharmacyAlertsPage />
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