import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

// ── Module mocks ────────────────────────────────────────────────────────────
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  usePathname: () => "/patients",
}));

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    className,
    "aria-label": ariaLabel,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
    "aria-label"?: string;
  }) => (
    <a href={href} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  ),
}));

// ── Shared helpers ───────────────────────────────────────────────────────────
function makeClient() {
  return new QueryClient({ defaultOptions: { queries: { retry: false } } });
}

function wrap(ui: React.ReactElement) {
  const client = makeClient();
  return render(<QueryClientProvider client={client}>{ui}</QueryClientProvider>);
}

// ── PatientList tests ────────────────────────────────────────────────────────
describe("PatientList component", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("shows loading state while data is being fetched", async () => {
    vi.doMock("@/features/patients/hooks/use-patients", () => ({
      usePatients: () => ({ data: undefined, isLoading: true, error: null }),
    }));
    const { PatientList } = await import(
      "@/features/patients/components/patient-list"
    );
    wrap(<PatientList />);
    // DataTableShell shows a skeleton with aria-busy when isLoading=true
    expect(screen.getByRole("generic", { busy: true })).toBeInTheDocument();
  });

  it("renders patient rows from API data", async () => {
    const mockPatients = [
      {
        id: "p1",
        patientNumber: "CG-2026-0001",
        firstName: "Alice",
        lastName: "Smith",
        displayName: "Alice Smith",
        dateOfBirth: "1980-01-01T00:00:00.000Z",
        gender: "FEMALE",
        bloodGroup: "O+",
        allergies: [],
        createdAt: "2026-01-01T00:00:00.000Z",
      },
    ];
    vi.doMock("@/features/patients/hooks/use-patients", () => ({
      usePatients: () => ({
        data: { items: mockPatients },
        isLoading: false,
        error: null,
      }),
    }));
    const { PatientList } = await import(
      "@/features/patients/components/patient-list"
    );
    wrap(<PatientList />);
    expect(screen.getByText("Alice Smith")).toBeInTheDocument();
    expect(screen.getByText("CG-2026-0001")).toBeInTheDocument();
  });

  it("shows error state when API fails", async () => {
    vi.doMock("@/features/patients/hooks/use-patients", () => ({
      usePatients: () => ({
        data: undefined,
        isLoading: false,
        error: new Error("Network failure"),
      }),
    }));
    const { PatientList } = await import(
      "@/features/patients/components/patient-list"
    );
    wrap(<PatientList />);
    expect(screen.getByText(/Network failure/i)).toBeInTheDocument();
  });

  it("renders a View Patient link for each patient row", async () => {
    const mockPatients = [
      {
        id: "p99",
        patientNumber: "CG-0099",
        firstName: "Bob",
        lastName: "Jones",
        displayName: "Bob Jones",
        dateOfBirth: "1970-06-15T00:00:00.000Z",
        gender: "MALE",
        bloodGroup: "A+",
        allergies: [],
        createdAt: "2026-01-01T00:00:00.000Z",
      },
    ];
    vi.doMock("@/features/patients/hooks/use-patients", () => ({
      usePatients: () => ({
        data: { items: mockPatients },
        isLoading: false,
        error: null,
      }),
    }));
    const { PatientList } = await import(
      "@/features/patients/components/patient-list"
    );
    wrap(<PatientList />);
    const link = screen.getByRole("link", { name: /View patient Bob Jones/i });
    expect(link).toHaveAttribute("href", "/patients/p99");
  });
});

// ── VitalsCharts tests ───────────────────────────────────────────────────────
describe("VitalsCharts component", () => {
  it("shows empty state when no vitals exist", async () => {
    const { VitalsCharts } = await import(
      "@/features/patients/components/vitals-charts"
    );
    render(<VitalsCharts vitals={[]} />);
    expect(screen.getByRole("heading", { name: /No vitals recorded/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /No vitals recorded/i }).parentElement).toHaveClass(
      "bg-gradient-to-br",
    );
  });

  it("renders chart headings when vitals data is provided", async () => {
    const vitals = [
      {
        id: "v1",
        patientId: "p1",
        recordedAt: "2026-09-12T10:00:00.000Z",
        temperatureCelsius: 37.2,
        systolicBp: 118,
        diastolicBp: 78,
        oxygenSaturationPercent: 98,
        recordedByUserId: "u1",
      },
    ];
    const { VitalsCharts } = await import(
      "@/features/patients/components/vitals-charts"
    );
    render(<VitalsCharts vitals={vitals} />);
    expect(screen.getByText(/Temperature/i)).toBeInTheDocument();
    expect(screen.getByText(/Blood Pressure/i)).toBeInTheDocument();
    expect(screen.getByText(/Oxygen Saturation/i)).toBeInTheDocument();
  });
});

// ── DailyUpdatesTimeline tests ───────────────────────────────────────────────
describe("DailyUpdatesTimeline component", () => {
  it("shows empty state when no updates exist", async () => {
    const { DailyUpdatesTimeline } = await import(
      "@/features/patients/components/daily-updates-timeline"
    );
    render(<DailyUpdatesTimeline updates={[]} />);
    expect(screen.getByRole("heading", { name: /No daily updates/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /No daily updates/i }).parentElement).toHaveClass(
      "bg-gradient-to-br",
    );
  });

  it("renders existing updates with author role and content", async () => {
    const updates = [
      {
        id: "u1",
        patientId: "p1",
        content: "Patient is stable and improving.",
        authorUserId: "staff1",
        authorRole: "NURSE",
        createdAt: "2026-09-12T08:00:00.000Z",
        visibility: "STAFF" as const,
      },
    ];
    const { DailyUpdatesTimeline } = await import(
      "@/features/patients/components/daily-updates-timeline"
    );
    render(<DailyUpdatesTimeline updates={updates} />);
    expect(screen.getByText(/Patient is stable and improving/i)).toBeInTheDocument();
    expect(screen.getByText(/NURSE/i)).toBeInTheDocument();
  });
});

// ── PatientLabResults tests ──────────────────────────────────────────────────
describe("PatientLabResults component", () => {
  it("shows empty state when no results exist", async () => {
    const { PatientLabResults } = await import(
      "@/features/patients/components/patient-lab-results"
    );
    render(<PatientLabResults results={[]} />);
    expect(screen.getByRole("heading", { name: /No lab results/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /No lab results/i }).parentElement).toHaveClass(
      "bg-gradient-to-br",
    );
  });

  it("renders lab result rows", async () => {
    const results = [
      {
        id: "lr1",
        patientId: "p1",
        testName: "Complete Blood Count",
        resultDisplay: "Normal",
        referenceRange: "4–11 × 10^9/L",
        flag: "NORMAL" as const,
        performedAt: "2026-09-11T14:00:00.000Z",
      },
    ];
    const { PatientLabResults } = await import(
      "@/features/patients/components/patient-lab-results"
    );
    render(<PatientLabResults results={results} />);
    expect(screen.getByText("Complete Blood Count")).toBeInTheDocument();
    expect(screen.getByText("Normal")).toBeInTheDocument();
    expect(screen.getByText("4–11 × 10^9/L")).toBeInTheDocument();
  });
});

// ── CreateUpdateForm tests ───────────────────────────────────────────────────
describe("CreateUpdateForm component", () => {
  const mockMutate = vi.fn();
  const mockOnSuccess = vi.fn();
  const mockOnCancel = vi.fn();

  beforeEach(() => {
    vi.resetModules();
    mockMutate.mockReset();
    mockOnSuccess.mockReset();
    mockOnCancel.mockReset();
  });

  it("shows the content textarea", async () => {
    vi.doMock("@/features/patients/hooks/use-patients", () => ({
      useCreatePatientUpdate: () => ({ mutate: mockMutate, isPending: false }),
    }));
    const { CreateUpdateForm } = await import(
      "@/features/patients/components/create-update-form"
    );
    render(
      <CreateUpdateForm
        patientId="p1"
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("does NOT expose a staff/family visibility selector", async () => {
    vi.doMock("@/features/patients/hooks/use-patients", () => ({
      useCreatePatientUpdate: () => ({ mutate: mockMutate, isPending: false }),
    }));
    const { CreateUpdateForm } = await import(
      "@/features/patients/components/create-update-form"
    );
    render(
      <CreateUpdateForm
        patientId="p1"
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );
    // Visibility selector must NOT be in the document
    expect(screen.queryByRole("combobox", { name: /visibility/i })).toBeNull();
  });

  it("blocks submission when content is too short", async () => {
    const user = userEvent.setup();
    vi.doMock("@/features/patients/hooks/use-patients", () => ({
      useCreatePatientUpdate: () => ({ mutate: mockMutate, isPending: false }),
    }));
    const { CreateUpdateForm } = await import(
      "@/features/patients/components/create-update-form"
    );
    render(
      <CreateUpdateForm
        patientId="p1"
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );
    await user.type(screen.getByRole("textbox"), "Hi");
    await user.click(screen.getByRole("button", { name: /post update/i }));
    await waitFor(() => {
      expect(mockMutate).not.toHaveBeenCalled();
    });
    expect(screen.getByText(/at least 5 characters/i)).toBeInTheDocument();
  });

  it("calls the mutation when content is valid", async () => {
    const user = userEvent.setup();
    mockMutate.mockImplementation((_payload: unknown, opts: { onSuccess?: () => void }) =>
      opts?.onSuccess?.()
    );
    vi.doMock("@/features/patients/hooks/use-patients", () => ({
      useCreatePatientUpdate: () => ({ mutate: mockMutate, isPending: false }),
    }));
    const { CreateUpdateForm } = await import(
      "@/features/patients/components/create-update-form"
    );
    render(
      <CreateUpdateForm
        patientId="p1"
        onSuccess={mockOnSuccess}
        onCancel={mockOnCancel}
      />
    );
    await user.type(screen.getByRole("textbox"), "Patient is recovering well today.");
    await user.click(screen.getByRole("button", { name: /post update/i }));
    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalled();
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });
});
