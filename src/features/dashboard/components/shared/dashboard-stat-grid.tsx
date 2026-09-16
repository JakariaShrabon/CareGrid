import { ReactNode } from "react";

interface DashboardStatGridProps {
  children: ReactNode;
}

export function DashboardStatGrid({ children }: DashboardStatGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {children}
    </div>
  );
}
