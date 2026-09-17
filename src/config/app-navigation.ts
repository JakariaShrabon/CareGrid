import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  BedDouble,
  Bell,
  ClipboardPlus,
  Droplets,
  FileCheck2,
  HeartHandshake,
  HeartPulse,
  Landmark,
  LayoutDashboard,
  ListChecks,
  Pill,
  ReceiptText,
  Settings,
  ShieldAlert,
  Siren,
  Timer,
  Users,
  UsersRound,
} from 'lucide-react'
import type { StatusTone } from '@/components/common/status-badge'

/**
 * Single source of truth for the authenticated application navigation.
 * Both the sidebar, mobile drawer, breadcrumbs and global search read from
 * this config so labels and routes stay in sync.
 */

export type AppNavGroupId =
  | 'overview'
  | 'clinical'
  | 'organ'
  | 'blood'
  | 'pharmacy'
  | 'financial'
  | 'system'

export interface AppNavItem {
  label: string
  href: string
  icon: LucideIcon
  /** Optional trailing pill, e.g. the Emergency SOS marker. */
  badge?: string
  badgeTone?: StatusTone
}

export interface AppNavGroup {
  id: AppNavGroupId
  label: string
  items: AppNavItem[]
}

export const appNavigation: AppNavGroup[] = [
  {
    id: 'overview',
    label: 'Overview',
    items: [{ label: 'Dashboard', href: '/app/dashboard', icon: LayoutDashboard }],
  },
  {
    id: 'clinical',
    label: 'Clinical',
    items: [
      { label: 'Patients', href: '/app/patients', icon: Users },
      { label: 'Vitals', href: '/app/vitals', icon: Activity },
      { label: 'Wards & Beds', href: '/app/wards', icon: BedDouble },
    ],
  },
  {
    id: 'organ',
    label: 'Organ Care',
    items: [
      { label: 'Organ Matching', href: '/app/organ/matching', icon: HeartPulse },
      { label: 'Waiting List', href: '/app/organ/waiting-list', icon: ListChecks },
      { label: 'Ischemia', href: '/app/organ/ischemia', icon: Timer },
      { label: 'Living Donors', href: '/app/organ/donors', icon: HeartHandshake },
    ],
  },
  {
    id: 'blood',
    label: 'Blood Bank',
    items: [
      { label: 'Inventory', href: '/app/blood/inventory', icon: Droplets },
      { label: 'Donors', href: '/app/blood/donors', icon: UsersRound },
      { label: 'Requests', href: '/app/blood/requests', icon: Bell },
      {
        label: 'Emergency SOS',
        href: '/app/blood/sos',
        icon: Siren,
        badge: 'SOS',
        badgeTone: 'critical',
      },
    ],
  },
  {
    id: 'pharmacy',
    label: 'Pharmacy',
    items: [
      { label: 'Prescriptions', href: '/app/pharmacy/prescriptions', icon: ClipboardPlus },
      { label: 'Inventory', href: '/app/pharmacy/inventory', icon: Pill },
      { label: 'Safety Alerts', href: '/app/pharmacy/alerts', icon: ShieldAlert },
    ],
  },
  {
    id: 'financial',
    label: 'Financial',
    items: [
      { label: 'Billing', href: '/app/billing', icon: ReceiptText },
      { label: 'Insurance', href: '/app/billing/insurance', icon: Landmark },
      { label: 'Discharge', href: '/app/billing/discharge', icon: FileCheck2 },
    ],
  },
  {
    id: 'system',
    label: 'System',
    items: [
      { label: 'Notifications', href: '/app/notifications', icon: Bell },
      { label: 'Settings', href: '/app/settings', icon: Settings },
    ],
  },
]

export interface AppNavMatch {
  group: AppNavGroup
  item: AppNavItem
}

/** Resolve a route path to its navigation section and item, if any. */
export function findAppNavItem(pathname: string): AppNavMatch | null {
  for (const group of appNavigation) {
    const item = group.items.find((entry) => {
      if (entry.href === pathname) return true
      return (
        pathname.startsWith(`${entry.href}/`) &&
        entry.href !== '/app/dashboard'
      )
    })
    if (item) return { group, item }
  }
  return null
}

/** Exact-and-subtree match for highlighting paginated detail routes. */
export function isAppNavItemActive(item: AppNavItem, pathname: string): boolean {
  if (item.href === pathname) return true
  return pathname.startsWith(`${item.href}/`)
}

export const flattenedAppNavItems: AppNavItem[] = appNavigation.flatMap(
  (group) => group.items,
)