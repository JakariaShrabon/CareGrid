import type {
  ActivityEvent,
  AppNotification,
  DashboardOverview,
  NotificationCategory,
} from '@/types/dashboard'

export type {
  DashboardOverview,
  AppNotification,
  ActivityEvent,
  NotificationCategory,
}

/**
 * Dashboard data service contract. The UI reads everything through this
 * interface (via React Query at the page level), so a Spring Boot REST
 * implementation can replace the mock later with the exact same shape.
 */
export interface DashboardService {
  /** Combined operational overview for the dashboard landing view. */
  getOverview(): Promise<DashboardOverview>
  /** Fictional notification feed for the notification center. */
  getNotifications(): Promise<AppNotification[]>
  /** Fictional recent activity timeline for the dashboard. */
  getRecentActivity(): Promise<ActivityEvent[]>
}