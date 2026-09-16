import { describe, it, expect, beforeEach, beforeAll, afterAll, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { resetMockDatabase, getMockDatabase } from "@/mocks/database/store";
import { pharmacyHandlers } from "@/mocks/handlers/pharmacy";
import { patientHandlers } from "@/mocks/handlers/patients";
import { PharmacyOverviewCards } from "@/features/pharmacy/components/pharmacy-overview-cards";
import { PrescriptionQueueTable } from "@/features/pharmacy/components/prescription-queue-table";
import { PharmacyInventoryTable } from "@/features/pharmacy/components/pharmacy-inventory-table";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const server = setupServer(...pharmacyHandlers, ...patientHandlers);

beforeAll(() => server.listen({ onUnhandledRequest: "warn" }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

function renderWithProviders(ui: React.ReactElement) {
  // Use a fresh query client for each test to avoid cache pollution
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(<QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>);
}

describe("Pharmacy Module", () => {
  beforeEach(() => {
    resetMockDatabase();
  });

  describe("PharmacyOverviewCards", () => {
    it("renders loading state initially", () => {
      renderWithProviders(<PharmacyOverviewCards />);
      expect(screen.getByLabelText(/Loading pharmacy metrics/i)).toBeInTheDocument();
    });

    it("renders overview metrics after loading", async () => {
      renderWithProviders(<PharmacyOverviewCards />);
      await waitFor(() => {
        expect(screen.getByText("Pending Prescriptions")).toBeInTheDocument();
        expect(screen.getByText("Dispensed")).toBeInTheDocument();
        expect(screen.getByText("Safety Warnings")).toBeInTheDocument();
        expect(screen.getByText("Low Stock Items")).toBeInTheDocument();
      });
    });
  });

  describe("PrescriptionQueueTable", () => {
    it("renders the prescription queue table with data", async () => {
      renderWithProviders(<PrescriptionQueueTable />);
      
      await waitFor(() => {
        // Table headers
        expect(screen.getByText("Prescription ID")).toBeInTheDocument();
        expect(screen.getByText("Safety Status")).toBeInTheDocument();
        expect(screen.getByText("Workflow")).toBeInTheDocument();
      });
      
      const db = getMockDatabase();
      if (db.prescriptions.length > 0) {
        await waitFor(() => {
          expect(screen.getByText(db.prescriptions[0].id)).toBeInTheDocument();
        });
      }
    });

    it("filters prescriptions based on search term", async () => {
      renderWithProviders(<PrescriptionQueueTable />);
      const user = userEvent.setup();
      
      await waitFor(() => {
        expect(screen.getByPlaceholderText(/Search by ID/i)).toBeInTheDocument();
      });

      const searchInput = screen.getByPlaceholderText(/Search by ID/i);
      await user.type(searchInput, "nonexistent_id_9999");
      
      await waitFor(() => {
        expect(screen.queryByText("rx_")).not.toBeInTheDocument();
      });
    });
  });

  describe("PharmacyInventoryTable", () => {
    it("renders inventory data mapped to medicines", async () => {
      renderWithProviders(<PharmacyInventoryTable />);
      
      await waitFor(() => {
        expect(screen.getByText("Available Quantity")).toBeInTheDocument();
      });

      const db = getMockDatabase();
      if (db.medicines.length > 0) {
        await waitFor(() => {
          expect(screen.getByText(db.medicines[0].genericName)).toBeInTheDocument();
        });
      }
    });
  });
});
