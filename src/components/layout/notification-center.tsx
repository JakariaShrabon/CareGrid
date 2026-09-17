import {
  BedDouble,
  Bell,
  ClipboardPlus,
  Droplets,
  HeartPulse,
  ReceiptText,
  UserRound,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { cn } from 'cn'
import { ErrorState } from '@/components/common/error-state'
import { LoadingState } from '@/components/common/loading-state'
import { StatusBadge } from '@/components/common/status-badge'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  dashboardService,
  type NotificationCategory,
} from '@/services'
import { useNotificationStore } from '@/store/use-notification-store'
import { timeAgo } from '@/lib/time'
import { EmptyState } from '@/components/common/empty-state'

const categoryMeta: Record<
  NotificationCategory,
  { icon: LucideIcon; label: string }
> = {
  patient: { icon: UserRound, label: 'Patient care' },
  bed: { icon: BedDouble, label: 'Wards & beds' },
  blood: { icon: Droplets, label: 'Blood bank' },
  prescription: { icon: ClipboardPlus, label: 'Pharmacy' },
  organ: { icon: HeartPulse, label: 'Organ care' },
  billing: { icon: ReceiptText, label: 'Billing' },
}

const severityTone = {
  critical: 'critical',
  warning: 'warning',
  info: 'info',
} as const

interface NotificationListProps {
  onNavigate?: () => void
  /** Cap the number of rows (used by the popover preview). */
  limit?: number
}

/** Shared notification feed used by the popover and the full page. */
export function NotificationList({ onNavigate, limit }: NotificationListProps) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => dashboardService.getNotifications(),
  })
  const readIds = useNotificationStore((state) => state.readIds)
  const markRead = useNotificationStore((state) => state.markRead)
  const navigate = useNavigate()

  if (isLoading) return <LoadingState rows={3} className="px-4 py-4" />
  if (isError)
    return (
      <div className="p-4">
        <ErrorState onRetry={() => refetch()} />
      </div>
    )

  const items = limit ? (data ? data.slice(0, limit) : []) : (data ?? [])
  if (!items.length)
    return (
      <EmptyState
        title="You're all caught up"
        description="New notifications will appear here."
        className="border-0 bg-transparent py-10"
      />
    )

  return (
    <ul className="divide-y divide-border">
      {items.map((notification) => {
        const read = readIds.includes(notification.id)
        const meta = categoryMeta[notification.category]
        const Icon = meta.icon
        return (
          <li key={notification.id}>
            <button
              type="button"
              onClick={() => {
                if (!read) markRead(notification.id)
                if (notification.href) {
                  navigate(notification.href)
                  onNavigate?.()
                }
              }}
              className={cn(
                'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring focus-visible:outline-none',
                !read && 'bg-muted/40',
              )}
            >
              <span
                className={cn(
                  'mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-md',
                  notification.severity === 'critical' && 'bg-red-500/10 text-red-600 dark:text-red-400',
                  notification.severity === 'warning' && 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
                  notification.severity === 'info' && 'bg-sky-500/10 text-sky-600 dark:text-sky-400',
                )}
              >
                <Icon className="size-4" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium">
                    {notification.title}
                  </span>
                  <span className="sr-only">{read ? 'Read' : 'Unread'}</span>
                  {!read ? (
                    <span
                      className="size-1.5 shrink-0 rounded-full bg-primary"
                      aria-hidden="true"
                    />
                  ) : null}
                </span>
                <span className="mt-0.5 line-clamp-2 block text-sm text-muted-foreground">
                  {notification.body}
                </span>
                <span className="mt-1.5 flex flex-wrap items-center gap-2">
                  <StatusBadge
                    tone={severityTone[notification.severity]}
                    label={meta.label}
                  />
                  <span className="text-xs text-muted-foreground">
                    {timeAgo(notification.time)}
                  </span>
                </span>
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

/** Topbar bell with unread badge and a presentation-grade panel. */
export function NotificationCenter() {
  const [open, setOpen] = useState(false)
  const { data } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => dashboardService.getNotifications(),
  })
  const readIds = useNotificationStore((state) => state.readIds)
  const markAllRead = useNotificationStore((state) => state.markAllRead)

  const unread = data
    ? data.filter((notification) => !readIds.includes(notification.id)).length
    : 0

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={
            unread > 0
              ? `Notifications, ${unread} unread`
              : 'Notifications, none unread'
          }
        >
          <Bell className="size-4.5" aria-hidden="true" />
          {unread > 0 ? (
            <span className="absolute top-1.5 right-1.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-destructive px-1 text-[10px] leading-none font-semibold text-white">
              {unread}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-[min(92vw,22rem)] p-0"
        aria-label="Notifications"
      >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <p className="text-sm font-semibold">Notifications</p>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            disabled={unread === 0}
            onClick={() => data && markAllRead(data.map((n) => n.id))}
          >
            Mark all read
          </Button>
        </div>
        <ScrollArea className="max-h-80">
          <NotificationList limit={5} onNavigate={() => setOpen(false)} />
        </ScrollArea>
        <div className="border-t px-4 py-2">
          <Button asChild variant="ghost" size="sm" className="h-8 w-full text-xs">
            <Link to="/app/notifications" onClick={() => setOpen(false)}>
              View all notifications
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}