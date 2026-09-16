import { render, screen } from "@testing-library/react";
import { Activity, AlertTriangle } from "lucide-react";
import { describe, expect, it } from "vitest";

import { StatusBadge } from "@/components/data-display/status-badge";
import { PageHeader } from "@/components/layout/page-container";
import { ErrorState } from "@/components/feedback/error-state";
import { EmptyState } from "@/components/feedback/empty-state";
import { LoadingState } from "@/components/feedback/loading-state";
import { DataTableShell } from "@/components/data-display/data-table-shell";
import { StatCard } from "@/components/data-display/stat-card";

describe("CareGrid design-system primitives", () => {
  it("renders semantic status text with an icon so meaning is not color-only", () => {
    render(<StatusBadge status="CRITICAL" />);

    expect(screen.getByText("Critical")).toBeInTheDocument();
    expect(screen.getByText("Critical").closest("[data-tone]")).toHaveAttribute(
      "data-tone",
      "critical",
    );
    expect(screen.getByText("Critical").previousElementSibling).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("renders a compact page header with title, description, eyebrow, and action", () => {
    render(
      <PageHeader
        eyebrow="Clinical workspace"
        title="CareGrid Foundation"
        description="Reusable shell and interface patterns for future modules."
        actions={<button type="button">Primary Action</button>}
      />,
    );

    expect(screen.getByRole("heading", { level: 1, name: "CareGrid Foundation" })).toBeInTheDocument();
    expect(screen.getByText("Clinical workspace")).toBeInTheDocument();
    expect(screen.getByText("Reusable shell and interface patterns for future modules.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Primary Action" })).toBeInTheDocument();
  });

  it("renders feedback states with clear accessible messaging", () => {
    render(
      <div>
        <EmptyState
          icon={Activity}
          title="No records found"
          description="Try adjusting filters or checking back later."
        />
        <ErrorState
          icon={AlertTriangle}
          title="Unable to load"
          description="Refresh the page or contact support if it continues."
        />
        <LoadingState label="Loading clinical context" />
      </div>,
    );

    expect(screen.getByRole("heading", { name: "No records found" })).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Unable to load");
    expect(screen.getByRole("heading", { name: "No records found" }).parentElement).toHaveClass(
      "bg-gradient-to-br",
    );
    expect(screen.getByRole("alert")).toHaveClass("bg-gradient-to-br");
    expect(screen.getByLabelText("Loading clinical context")).toHaveClass("bg-gradient-to-br");
  });

  it("uses medical gradient surfaces and safe fallback values for stat cards and empty tables", () => {
    render(
      <div>
        <StatCard title="Open beds" value={null} icon={Activity} description="Ward capacity" />
        <DataTableShell title="Patients" isEmpty emptyTitle="No patients" emptyDescription="No matching patients.">
          <table>
            <tbody>
              <tr>
                <td>Hidden</td>
              </tr>
            </tbody>
          </table>
        </DataTableShell>
      </div>,
    );

    expect(screen.getByText("Open beds").closest("[data-caregrid-surface='stat-card']")).toHaveClass(
      "bg-gradient-to-br",
    );
    expect(screen.getByText("Open beds").nextElementSibling).toHaveTextContent("—");
    expect(screen.getByRole("heading", { name: "No patients" })).toBeInTheDocument();
    expect(screen.getByText("Patients").closest("[data-caregrid-surface='table-shell']")).toHaveClass(
      "bg-gradient-to-br",
    );
  });
});
