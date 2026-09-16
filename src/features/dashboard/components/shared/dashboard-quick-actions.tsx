import Link from "next/link";
import { LucideIcon, ShieldCheck } from "lucide-react";
import { useAuth } from "@/features/auth/auth-provider";
import { Permission, ROLE_PERMISSIONS } from "@/config/permissions";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/feedback/empty-state";
import { cn } from "@/lib/utils/cn";

export interface DashboardQuickActionProps {
  label: string;
  href: string;
  icon: LucideIcon;
  requiredPermission?: Permission;
  colorClass?: string;
}

export function DashboardQuickActions({
  actions,
  variant = "tiles",
}: {
  actions: DashboardQuickActionProps[];
  variant?: "tiles" | "care";
}) {
  const { session } = useAuth();
  const userRole = session?.user.role;

  const permittedActions = actions.filter(
    (action) => {
      if (!action.requiredPermission) return true;
      if (!userRole) return false;
      return ROLE_PERMISSIONS[userRole].includes(action.requiredPermission);
    }
  );

  if (permittedActions.length === 0) {
    return (
      <EmptyState
        icon={ShieldCheck}
        title="No quick actions available"
        description="Actions that match your access level will appear here."
      />
    );
  }

  if (variant === "care") {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {permittedActions.map((action) => (
          <Link key={action.href} href={action.href} className="block group">
            <Card className="flex min-h-[88px] items-center gap-4 border-cyan-100/80 bg-gradient-to-br from-white via-cyan-50/50 to-emerald-50/40 p-4 transition-colors hover:border-primary/50 hover:from-cyan-50 hover:to-emerald-50">
              <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-lg", action.colorClass || "bg-primary/10 text-primary")}>
                <action.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 text-left">
                <span className="block text-sm font-semibold leading-5 text-slate-900 transition-colors group-hover:text-primary">
                  {action.label}
                </span>
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                  Open patient-safe care details
                </span>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
      {permittedActions.map((action) => (
        <Link key={action.href} href={action.href} className="block group">
          <Card className="flex flex-col items-center justify-center space-y-3 border-cyan-100/80 bg-gradient-to-br from-white via-cyan-50/50 to-emerald-50/40 p-6 transition-colors hover:border-primary/50 hover:from-cyan-50 hover:to-emerald-50">
            <div className={`p-3 rounded-full ${action.colorClass || "bg-primary/10 text-primary"}`}>
              <action.icon className="w-6 h-6" />
            </div>
            <span className="text-sm font-medium text-center text-slate-700 group-hover:text-primary transition-colors">
              {action.label}
            </span>
          </Card>
        </Link>
      ))}
    </div>
  );
}
