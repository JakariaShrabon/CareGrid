import { describe, it, expect, vi, beforeAll, beforeEach, afterEach, afterAll } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BloodOverviewCards } from "@/features/blood-bank/components/blood-overview-cards";
import { InventoryTable } from "@/features/blood-bank/components/inventory-table";
import { BloodUnitTable } from "@/features/blood-bank/components/blood-unit-table";
import { DonorTable } from "@/features/blood-bank/components/donor-table";
import { SosList } from "@/features/blood-bank/components/sos-list";
import { CreateSosForm } from "@/features/blood-bank/components/create-sos-form";
import { DonorMapWrapper } from "@/features/blood-bank/components/donor-map-wrapper";
import { bloodHandlers } from "@/mocks/handlers/blood";
import { setupServer } from "msw/node";
import { resetMockDatabase } from "@/mocks/database/store";

// Fix for Next.js Link component in tests
vi.mock("next/link", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

// Mock leaflet since it throws if window is not available (which jsdom doesn't fully simulate for canvas)
vi.mock("next/dynamic", () => ({
  default: () => {
    const MockMap = () => <div data-testid="mock-leaflet-map">Leaflet Map Placeholder</div>;
    return MockMap;
  }
}));

const server = setupServer(...bloodHandlers);

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: false, staleTime: 0 } },
});

function wrap(ui: React.ReactElement) {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
}

beforeAll(() => {
  server.listen({ onUnhandledRequest: "error" });
});
beforeEach(() => {
  resetMockDatabase();
  queryClient.clear();
});
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => {
  server.close();
});

describe("Blood Bank Module", () => {
  describe("BloodOverviewCards", () => {
    it("renders loading state initially", () => {
      wrap(<BloodOverviewCards />);
      expect(screen.getAllByRole("generic", { busy: true }).length).toBeGreaterThan(0);
    });

    it("renders metrics after fetching", async () => {
      wrap(<BloodOverviewCards />);
      expect(await screen.findByText("Total Units")).toBeInTheDocument();
      expect(screen.getByText("Available Units")).toBeInTheDocument();
      expect(screen.getByText("Active SOS Requests")).toBeInTheDocument();
      expect(screen.getByText("Registered Donors")).toBeInTheDocument();
    });
  });

  describe("InventoryTable", () => {
    it("renders inventory matrix correctly", async () => {
      wrap(<InventoryTable />);
      expect(await screen.findByRole("table")).toBeInTheDocument();
      expect(screen.getByText("Component Inventory Matrix")).toBeInTheDocument();
      // O+ WHOLE_BLOOD is in the mock data
      expect(screen.getByText("Whole Blood")).toBeInTheDocument();
      expect(screen.getByText("Safe")).toBeInTheDocument();
    });
  });

  describe("BloodUnitTable", () => {
    it("renders blood units list", async () => {
      wrap(<BloodUnitTable />);
      expect(await screen.findByRole("table")).toBeInTheDocument();
      expect(screen.getByText("Unit ID")).toBeInTheDocument();
      expect(screen.getByText("Collected At")).toBeInTheDocument();
    });
  });

  describe("DonorTable", () => {
    it("renders privacy-conscious donor directory", async () => {
      wrap(<DonorTable />);
      expect(await screen.findByRole("table")).toBeInTheDocument();
      expect(screen.getByText("Donor Reference")).toBeInTheDocument();
      expect(screen.getByText("Eligibility")).toBeInTheDocument();
    });
  });

  describe("Emergency SOS Workflow", () => {
    it("renders active SOS list", async () => {
      wrap(<SosList />);
      // We expect either loading or the list
      expect(await screen.findByText(/No active SOS requests|Emergency Shortage/i)).toBeInTheDocument();
    });

    it("requires confirmation before broadcasting SOS", async () => {
      const user = userEvent.setup();
      wrap(<CreateSosForm />);

      // Fill out the required fields
      await user.selectOptions(screen.getByLabelText(/Required Blood Group/i), "O-");
      await user.selectOptions(screen.getByLabelText(/Blood Component/i), "RBC");
      await user.clear(screen.getByLabelText(/Required Units/i));
      await user.type(screen.getByLabelText(/Required Units/i), "5");
      await user.selectOptions(screen.getByLabelText(/Clinical Urgency/i), "CRITICAL");
      await user.type(screen.getByLabelText(/Emergency Clinical Context/i), "Mass casualty incident in downtown.");

      // Click the review button
      await user.click(screen.getByRole("button", { name: /Review SOS Broadcast/i }));

      // Confirmation dialog should appear
      expect(await screen.findByText(/High-Impact Action/i)).toBeInTheDocument();
      
      // Confirm broadcast
      const confirmButton = screen.getByRole("button", { name: /Confirm Emergency SOS/i });
      await user.click(confirmButton);
      
      // The dialog should eventually close (mock API success)
    });
  });

  describe("Geofenced Donor Map", () => {
    it("renders map wrapper and fallback list", async () => {
      wrap(<DonorMapWrapper />);
      // Should show the fallback table header
      expect(await screen.findByText("Nearby Eligible Donors")).toBeInTheDocument();
      // Should show the mock map placeholder
      expect(screen.getByTestId("mock-leaflet-map")).toBeInTheDocument();
    });
  });
});
