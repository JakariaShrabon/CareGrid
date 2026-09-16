import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import MyCarePage from "@/app/(portal)/my-care/page";
import MyCareUpdatesPage from "@/app/(portal)/my-care/updates/page";

const patientState = vi.hoisted(() => ({
  patient: {
    id: "pat_001",
    patientNumber: "CG-2026-0001",
    firstName: "Emma",
    lastName: "Thompson",
    displayName: "Emma Thompson",
    dateOfBirth: "1996-05-04",
    gender: "FEMALE" as const,
    bloodGroup: "O+" as const,
    allergies: [],
    createdAt: "2026-09-12T00:00:00.000Z",
  },
  admission: {
    id: "adm_001",
    patientId: "pat_001",
    hospitalId: "hosp_1",
    wardId: "W1",
    roomId: "R12",
    bedId: "B4",
    primaryDoctorId: "doc_1",
    admittedAt: "2026-09-10T08:30:00.000Z",
    status: "ADMITTED" as const,
  },
  updates: [
    {
      id: "upd_001",
      patientId: "pat_001",
      content: "Patient is comfortable and responding well to care.",
      authorUserId: "nurse_1",
      authorRole: "NURSE",
      createdAt: "2026-09-14T10:00:00.000Z",
      visibility: "FAMILY" as const,
    },
  ],
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/my-care",
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
  useAuth: () => ({
    session: {
      user: {
        id: "usr_patient",
        name: "Emma Thompson",
        email: "patient@caregrid.demo",
        role: "PATIENT",
        patientId: "pat_001",
      },
    },
  }),
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
  usePatientUpdates: () => ({
    data: patientState.updates,
    isLoading: false,
    error: null,
  }),
}));

describe("My Care read-only portal", () => {
  beforeEach(() => {
    patientState.updates = [
      {
        id: "upd_001",
        patientId: "pat_001",
        content: "Patient is comfortable and responding well to care.",
        authorUserId: "nurse_1",
        authorRole: "NURSE",
        createdAt: "2026-09-14T10:00:00.000Z",
        visibility: "FAMILY",
      },
    ];
  });

  it("renders overview when patient and admission data are returned directly", () => {
    render(<MyCarePage />);

    expect(screen.getByRole("heading", { name: "My Care" })).toBeInTheDocument();
    expect(screen.getByText("Emma Thompson")).toBeInTheDocument();
    expect(screen.getByText("Currently admitted")).toBeInTheDocument();
    expect(screen.queryByText("Could not load your care context.")).not.toBeInTheDocument();
  });

  it("renders updates when update data is returned as a direct array", () => {
    render(<MyCareUpdatesPage />);

    expect(screen.getByRole("heading", { name: "My Care" })).toBeInTheDocument();
    expect(screen.getByText("Patient is comfortable and responding well to care.")).toBeInTheDocument();
    expect(screen.queryByText("Could not load care updates.")).not.toBeInTheDocument();
  });
});
