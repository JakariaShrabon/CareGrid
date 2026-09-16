import { Bell, Info, ShieldAlert, Zap } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Notification, NotificationType } from "@/contracts/notification";
import { EmptyState } from "@/components/feedback/empty-state";
import { Button } from "@/components/ui/button";

interface RecentNotificationListProps {
  notifications: Notification[];
  onViewAll?: () => void;
  variant?: "card" | "compact";
}

const typeConfig: Record<NotificationType, { icon: typeof Bell; color: string; bg: string }> = {
  PATIENT_UPDATE: { icon: Info, color: "text-blue-600", bg: "bg-blue-50" },
  BLOOD_LOW_STOCK: { icon: ShieldAlert, color: "text-orange-600", bg: "bg-orange-50" },
  BLOOD_EXPIRY: { icon: Zap, color: "text-red-600", bg: "bg-red-50" },
  SOS: { icon: Zap, color: "text-red-600", bg: "bg-red-50" },
  ORGAN_TIMER: { icon: Zap, color: "text-orange-600", bg: "bg-orange-50" },
  PRESCRIPTION: { icon: Bell, color: "text-emerald-600", bg: "bg-emerald-50" },
  CLAIM: { icon: Info, color: "text-blue-600", bg: "bg-blue-50" },
  DISCHARGE: { icon: Bell, color: "text-emerald-600", bg: "bg-emerald-50" },
};

export function RecentNotificationList({ notifications, onViewAll, variant = "card" }: RecentNotificationListProps) {
  const recent = notifications.slice(0, 3);

  if (variant === "compact") {
    if (notifications.length === 0) {
      return (
        <div
          data-caregrid-surface="recent-updates"
          className="max-h-72 rounded-lg border border-cyan-100/80 bg-gradient-to-br from-white via-cyan-50/50 to-emerald-50/40 p-4 shadow-sm"
        >
          <EmptyState title="All caught up" description="You have no recent care updates." />
        </div>
      );
    }

    return (
      <div
        data-caregrid-surface="recent-updates"
        className="max-h-72 overflow-y-auto rounded-lg border border-cyan-100/80 bg-gradient-to-br from-white via-cyan-50/50 to-emerald-50/40 p-4 shadow-sm"
      >
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-slate-950">Latest shared activity</p>
          {onViewAll && (
            <Button variant="ghost" size="sm" onClick={onViewAll} className="h-8 text-xs">
              View All
            </Button>
          )}
        </div>
        <div className="space-y-3">
          {recent.map((n) => {
            const config = typeConfig[n.type];
            const Icon = config.icon;
            return (
              <div key={n.id} className="flex items-start gap-3 rounded-md bg-white/75 p-3 ring-1 ring-cyan-100/70">
                <div className={`shrink-0 rounded-full p-2 ${config.bg} ${config.color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-900">{n.title}</p>
                  <p className="line-clamp-2 text-sm leading-5 text-slate-600">{n.message}</p>
                  <p className="mt-1 text-xs text-slate-400">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (notifications.length === 0) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Recent Notifications</CardTitle>
          {onViewAll && (
            <Button variant="ghost" size="sm" onClick={onViewAll} className="h-8 text-xs">
              View All
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <EmptyState title="All caught up" description="You have no recent notifications." />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Recent Notifications</CardTitle>
        {onViewAll && (
          <Button variant="ghost" size="sm" onClick={onViewAll} className="h-8 text-xs">
            View All
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mt-2">
          {recent.map((n) => {
            const config = typeConfig[n.type];
            const Icon = config.icon;
            return (
              <div key={n.id} className="flex items-start space-x-4">
                <div className={`p-2 rounded-full ${config.bg} ${config.color} shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{n.title}</p>
                  <p className="text-sm text-slate-500 line-clamp-1">{n.message}</p>
                  <p className="text-xs text-slate-400 mt-1">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
