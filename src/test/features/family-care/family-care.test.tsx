import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import FamilyCarePage from "@/app/(portal)/family-care/page";
import FamilyCareDischargePage from "@/app/(portal)/family-care/discharge/page";
import FamilyCareUpdatesPage from "@/app/(portal)/family-care/updates/page";

type MockFamilySession = {
  user: {
    id: string;
    name: string;
    email: string;
    role: "FAMILY_ATTENDANT";
    patientId?: string;
    createdAt: string;
  };
  authenticatedAt: string;
};

const authState = vi.hoisted((): { session: MockFamilySession } => ({
  session: {
    user: {
      id: "usr_family",
      name: "Family Member",
      email: "family@caregrid.demo",
      role: "FAMILY_ATTENDANT" as const,
      patientId: "pat_001",
      createdAt: "2026-09-12T00:00:00.000Z",
    },
    authenticatedAt: "2026-09-12T00:00:00.000Z",
  },
}));

const patientState = vi.hoisted(() => ({
  patient: {
    data: {
      id: "pat_001",
      displayName: "Anika Rahman",
      bloodGroup: "A+",
      gender: "FEMALE",
      age: 42,
    },
  },
  admission: {
    data: {
      id: "adm_001",
      status: "ADMITTED",
      admittedAt: "2026-09-10T08:30:00.000Z",
      wardId: "ward_1",
      bedId: "bed_12",
    },
  },
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/family-care",
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    className,
    "aria-current": ariaCurrent,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
    "aria-current"?: "page" | "step" | "location" | "date" | "time" | "true" | "false" | boolean;
  }) => (
    <a href={href} className={className} aria-current={ariaCurrent}>
      {children}
    </a>
  ),
}));

vi.mock("@/features/auth/auth-provider", () => ({
  useAuth: () => authState,
}));

vi.mock("@/features/patients/hooks/use-patients", () => ({
  usePatient: () => ({
    data: patientState.patient,
    isLoading: false,
    error: null,
  }),
  usePatientAdmission: () => ({
    data: patientState.admission,
    isLoading: false,
  }),
}));

vi.mock("@/features/patients/components/read-only-portal/updates-view", () => ({
  ReadOnlyUpdatesView: ({ basePath, title }: { basePath: string; title: string }) => (
    <section>
      <h1>{title}</h1>
      <p>{basePath}</p>
      <p>Polished updates timeline</p>
    </section>
  ),
}));

vi.mock("@/features/billing/components/discharge-summary-view", () => ({
  DischargeSummaryView: ({ patientId }: { patientId: string }) => (
    <section>
      <h2>Discharge Summary Mock</h2>
      <p>{patientId}</p>
    </section>
  ),
}));

describe("Family Care overview", () => {
  beforeEach(() => {
    authState.session = {
      user: {
        id: "usr_family",
        name: "Family Member",
        email: "family@caregrid.demo",
        role: "FAMILY_ATTENDANT",
        patientId: "pat_001",
        createdAt: "2026-09-12T00:00:00.000Z",
      },
      authenticatedAt: "2026-09-12T00:00:00.000Z",
    };
  });

  it("shows a polished overview with tabs for updates and discharge", () => {
    render(<FamilyCarePage />);

    expect(
      screen.getByRole("heading", { name: "Family Care Dashboard" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Anika Rahman")).toBeInTheDocument();
    expect(screen.getByText("Currently admitted")).toBeInTheDocument();
    expect(screen.getByText("Family access is read-only")).toBeInTheDocument();
    expect(
      screen
        .getAllByRole("link", { name: /Updates/i })
        .some((link) => link.getAttribute("href") === "/family-care/updates"),
    ).toBe(true);
    expect(
      screen
        .getAllByRole("link", { name: /Discharge/i })
        .some((link) => link.getAttribute("href") === "/family-care/discharge"),
    ).toBe(true);
  });

  it("keeps unlinked family accounts in a safe no-record state", () => {
    authState.session = {
      ...authState.session,
      user: {
        ...authState.session.user,
        patientId: undefined,
      },
    };

    render(<FamilyCarePage />);

    expect(screen.getByRole("heading", { name: "Family Care Dashboard" })).toBeInTheDocument();
    expect(screen.getByText("No linked patient profile")).toBeInTheDocument();
    expect(
      screen.getByText(/Your account is not linked to a patient profile/i),
    ).toBeInTheDocument();
  });

  it("gives updates and discharge their own family-care surfaces", () => {
    render(<FamilyCareUpdatesPage />);

    expect(screen.getByRole("heading", { name: "Family Care Updates" })).toBeInTheDocument();
    expect(screen.getByText("Polished updates timeline")).toBeInTheDocument();

    render(<FamilyCareDischargePage />);

    expect(screen.getByRole("heading", { name: "Family Care Discharge" })).toBeInTheDocument();
    expect(screen.getByText("Discharge Summary Mock")).toBeInTheDocument();
  });
});
