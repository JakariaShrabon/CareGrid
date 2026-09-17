import type { AppNotification } from '@/types/dashboard'

/**
 * Fictional notification feed for the demo notifications center. Timestamps
 * are generated relative to page load so relative times ("5m ago") stay
 * realistic. No real push notifications are involved.
 */
const minutesAgo = (minutes: number) =>
  new Date(Date.now() - minutes * 60_000).toISOString()

export const notificationsData: AppNotification[] = [
  {
    id: 'notif-01',
    category: 'patient',
    severity: 'critical',
    title: 'Critical patient alert',
    body: 'R-1042 (M. Rahman) flagged critical in ICU — review vitals now.',
    time: minutesAgo(9),
    href: '/app/patients',
  },
  {
    id: 'notif-02',
    category: 'blood',
    severity: 'warning',
    title: 'Blood stock warning',
    body: 'O− stock is below threshold (12 units). Near-expiry units are listed in inventory.',
    time: minutesAgo(32),
    href: '/app/blood/inventory',
  },
  {
    id: 'notif-03',
    category: 'prescription',
    severity: 'info',
    title: 'Prescription approved',
    body: 'RX-4208 approved by Dr. Anisur Rahman and forwarded to pharmacy.',
    time: minutesAgo(58),
    href: '/app/pharmacy/prescriptions',
  },
  {
    id: 'notif-04',
    category: 'bed',
    severity: 'info',
    title: 'Bed assigned',
    body: 'ICU bed 3 assigned to R-1042 in Ward 3.',
    time: minutesAgo(130),
    href: '/app/wards',
  },
  {
    id: 'notif-05',
    category: 'organ',
    severity: 'info',
    title: 'Organ match update',
    body: 'New compatible kidney match found for R. Karim (score 86).',
    time: minutesAgo(185),
    href: '/app/organ/matching',
  },
  {
    id: 'notif-06',
    category: 'billing',
    severity: 'info',
    title: 'Billing update',
    body: 'Claim #2026-0418 submitted to the insurer — under review.',
    time: minutesAgo(310),
    href: '/app/billing',
  },
]