"use client";

import { Building2, Mail, UserRound } from "lucide-react";

import { StatusBadge } from "@/components/data-display/status-badge";
import {
  PageContainer,
  PageHeader,
  PageSection,
  SectionHeader,
} from "@/components/layout/page-container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/features/auth/auth-provider";
import { EmptyState } from "@/components/feedback/empty-state";

export default function ProfilePage() {
  const { session } = useAuth();

  if (!session) {
    return (
      <PageContainer>
        <EmptyState title="Loading Profile" description="Your profile data is loading." />
      </PageContainer>
    );
  }

  const { user } = session;

  const profileRows = [
    { label: "Name", value: user.name, icon: UserRound },
    { label: "Email", value: user.email, icon: Mail },
    { label: "Hospital context", value: user.hospitalId ?? "Not assigned", icon: Building2 },
  ];

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Account"
        title="Profile"
        description="View your active session information."
      />

      <PageSection>
        <SectionHeader title="User Context" description="Displayed from the current session." />
        <div className="grid gap-4 lg:grid-cols-[1fr_18rem]">
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profileRows.map((row) => {
                const Icon = row.icon;
                return (
                  <div key={row.label} className="flex gap-3 rounded-lg border border-border bg-slate-50 p-3">
                    <Icon className="mt-0.5 h-4 w-4 text-primary" aria-hidden />
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        {row.label}
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-950">{row.value}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Role</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <StatusBadge label={user.role.replaceAll("_", " ")} tone="info" />
              <p className="text-sm leading-6 text-muted-foreground">
                Navigation visibility is driven by RBAC permissions based on this active role.
              </p>
            </CardContent>
          </Card>
        </div>
      </PageSection>
    </PageContainer>
  );
}
