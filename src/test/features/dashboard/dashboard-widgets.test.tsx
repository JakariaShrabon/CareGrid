import { render, screen } from "@testing-library/react";
import { Activity } from "lucide-react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { DashboardQuickActions } from "@/features/dashboard/components/shared/dashboard-quick-actions";
import { RecentNotificationList } from "@/features/dashboard/components/shared/recent-notification-list";
import { FamilyDashboard } from "@/features/dashboard/components/roles/family-dashboard";
import { PatientDashboard } from "@/features/dashboard/components/roles/patient-dashboard";

const dashboardState = vi.hoisted(() => ({
  patient: {
    patient: {
      displayName: "Emma Thompson",
      bloodGroup: "O+",
    },
    latestUpdate: {
      id: "upd_1",
      patientId: "pat_1",
      content: "Patient is comfortable.",
      authorUserId: "nurse_1",
      authorRole: "NURSE",
      createdAt: "2026-09-14T10:00:00.000Z",
      visibility: "FAMILY",
    },
    recentNotifications: [
      {
        id: "notif_1",
        userId: "usr_1",
        type: "PATIENT_UPDATE",
        title: "New Care Update",
        message: "A new update has been posted.",
        read: false,
        createdAt: "2026-09-14T10:05:00.000Z",
      },
    ],
  },
  family: {
    patient: {
      displayName: "Emma Thompson",
      bloodGroup: "O+",
    },
    admission: {
      wardId: "W1",
    },
    latestUpdate: {
      id: "upd_1",
      patientId: "pat_1",
      content: "Patient is comfortable.",
      authorUserId: "nurse_1",
      authorRole: "NURSE",
      createdAt: "2026-09-14T10:00:00.000Z",
      visibility: "FAMILY",
    },
    recentNotifications: [
      {
        id: "notif_1",
        userId: "usr_1",
        type: "PATIENT_UPDATE",
        title: "New Care Update",
        message: "A new update has been posted.",
        read: false,
        createdAt: "2026-09-14T10:05:00.000Z",
      },
    ],
  },
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

vi.mock("@/features/auth/auth-provider", () => ({
  useAuth: () => ({
    session: { user: { id: "u_1", email: "family@example.com", role: "FAMILY_ATTENDANT" } },
  }),
}));

vi.mock("@/features/dashboard/hooks/use-patient-dashboard-data", () => ({
  usePatientDashboardData: () => ({
    data: dashboardState.patient,
    isLoading: false,
    error: null,
  }),
}));

vi.mock("@/features/dashboard/hooks/use-family-dashboard-data", () => ({
  useFamilyDashboardData: () => ({
    data: dashboardState.family,
    isLoading: false,
    error: null,
  }),
}));

describe("dashboard widgets", () => {
  it("shows a polished empty state when no quick actions are permitted", () => {
    render(
      <DashboardQuickActions
        actions={[
          {
            label: "Manage wards",
            href: "/wards",
            icon: Activity,
            requiredPermission: "ward.manage",
          },
        ]}
      />,
    );

    expect(screen.getByRole("heading", { name: /No quick actions available/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /No quick actions available/i }).parentElement).toHaveClass(
      "bg-gradient-to-br",
    );
  });

  it("renders care quick actions as wide compact cards", () => {
    render(
      <DashboardQuickActions
        variant="care"
        actions={[
          {
            label: "Patient Updates",
            href: "/my-care/updates",
            icon: Activity,
            requiredPermission: "patient.read",
          },
        ]}
      />,
    );

    expect(screen.getByRole("link", { name: /Patient Updates/i }).firstElementChild).toHaveClass(
      "min-h-[88px]",
    );
  });

  it("renders recent notifications in a compact care panel", () => {
    render(
      <RecentNotificationList
        variant="compact"
        notifications={[
          {
            id: "notif_1",
            userId: "usr_1",
            type: "PATIENT_UPDATE",
            title: "New Care Update",
            message: "A new update has been posted.",
            read: false,
            createdAt: new Date().toISOString(),
          },
        ]}
      />,
    );

    expect(screen.getByText("New Care Update").closest("[data-caregrid-surface='recent-updates']")).toHaveClass(
      "max-h-72",
    );
  });

  it("uses the compact care layout in the patient dashboard", () => {
    render(<PatientDashboard />);

    expect(screen.getByRole("heading", { name: /Welcome, Emma Thompson/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /My Care Updates/i }).firstElementChild).toHaveClass(
      "min-h-[88px]",
    );
    expect(screen.getByText("New Care Update").closest("[data-caregrid-surface='recent-updates']")).toHaveClass(
      "max-h-72",
    );
  });

  it("uses the compact care layout in the family dashboard", () => {
    render(<FamilyDashboard />);

    expect(screen.getByRole("heading", { name: /Care for Emma Thompson/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Patient Updates/i }).firstElementChild).toHaveClass(
      "min-h-[88px]",
    );
    expect(screen.getByText("New Care Update").closest("[data-caregrid-surface='recent-updates']")).toHaveClass(
      "max-h-72",
    );
  });
});
