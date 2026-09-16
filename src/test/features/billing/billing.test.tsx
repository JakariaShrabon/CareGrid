import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BillDetail } from "@/features/billing/components/bill-detail";
import { BillItemsTable } from "@/features/billing/components/bill-items-table";
import { ClaimDetail } from "@/features/billing/components/claim-detail";
import { DischargeSummaryView } from "@/features/billing/components/discharge-summary-view";
import { useBill, useInsuranceClaim, useUpdateInsuranceClaim, useDischarge, useDownloadDischargePdf } from "@/features/billing/hooks/use-billing";
import { useAuth } from "@/features/auth/auth-provider";

// Mock the hooks
vi.mock("@/features/billing/hooks/use-billing", () => ({
  useBill: vi.fn(),
  useInsuranceClaim: vi.fn(),
  useUpdateInsuranceClaim: vi.fn(),
  useDischarge: vi.fn(),
  useDownloadDischargePdf: vi.fn(),
}));

vi.mock("@/features/auth/auth-provider", () => ({
  useAuth: vi.fn(),
}));

describe("Billing Module", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("BillDetail", () => {
    it("shows a resilient empty state when a bill is not found", () => {
      vi.mocked(useBill).mockReturnValue({
        data: null,
        isLoading: false,
      } as unknown as ReturnType<typeof useBill>);

      render(<BillDetail billId="missing_bill" />);

      expect(screen.getByRole("heading", { name: /Bill not found/i })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: /Bill not found/i }).parentElement).toHaveClass(
        "bg-gradient-to-br",
      );
    });

    it("shows a resilient empty state when an invoice has no itemized charges", () => {
      render(<BillItemsTable items={[]} />);

      expect(screen.getByRole("heading", { name: /No itemized charges/i })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: /No itemized charges/i }).parentElement).toHaveClass(
        "bg-gradient-to-br",
      );
    });

    it("renders itemized categories and totals correctly", () => {
      vi.mocked(useBill).mockReturnValue({
        data: {
          id: "bill_1",
          patientId: "pat_1",
          admissionId: "adm_1",
          status: "PENDING",
          generatedAt: "2026-09-12T10:00:00Z",
          dueDate: "2026-10-12T10:00:00Z",
          items: [
            { id: "i1", description: "General Ward", category: "ROOM", quantity: 3, unitPrice: { amount: "100", currency: "USD" }, totalPrice: { amount: "300", currency: "USD" } },
            { id: "i2", description: "Paracetamol", category: "PHARMACY", quantity: 1, unitPrice: { amount: "50", currency: "USD" }, totalPrice: { amount: "50", currency: "USD" } },
            { id: "i3", description: "Appendectomy", category: "SURGERY", quantity: 1, unitPrice: { amount: "1000", currency: "USD" }, totalPrice: { amount: "1000", currency: "USD" } },
            { id: "i4", description: "Specialist Visit", category: "CONSULTATION", quantity: 1, unitPrice: { amount: "150", currency: "USD" }, totalPrice: { amount: "150", currency: "USD" } },
          ],
          subtotal: { amount: "1500", currency: "USD" },
          insuranceAdjustment: { amount: "1000", currency: "USD" },
          patientPayable: { amount: "500", currency: "USD" },
        },
        isLoading: false,
      } as unknown as ReturnType<typeof useBill>);

      render(<BillDetail billId="bill_1" />);
      
      expect(screen.getByText("Invoice bill_1")).toBeInTheDocument();
      expect(screen.getByText("General Ward")).toBeInTheDocument();
      expect(screen.getByText("Room")).toBeInTheDocument();
      expect(screen.getByText("Paracetamol")).toBeInTheDocument();
      expect(screen.getByText("Pharmacy")).toBeInTheDocument();
      expect(screen.getByText("Appendectomy")).toBeInTheDocument();
      expect(screen.getByText("Surgery")).toBeInTheDocument();
      expect(screen.getByText("Specialist Visit")).toBeInTheDocument();
      expect(screen.getByText("Doctor Consultation")).toBeInTheDocument();
      
      // Totals
      expect(screen.getByText("$1,500.00")).toBeInTheDocument(); // subtotal
      expect(screen.getByText("-$1,000.00")).toBeInTheDocument(); // adjustment
      expect(screen.getByText("$500.00")).toBeInTheDocument(); // payable
    });
  });

  describe("ClaimDetail", () => {
    it("shows a resilient empty state when a claim is not found", () => {
      vi.mocked(useAuth).mockReturnValue({
        session: { user: { id: "u_1", email: "a@a.com", role: "BILLING_OFFICER" } }
      } as unknown as ReturnType<typeof useAuth>);

      vi.mocked(useInsuranceClaim).mockReturnValue({
        data: null,
        isLoading: false,
      } as unknown as ReturnType<typeof useInsuranceClaim>);

      vi.mocked(useUpdateInsuranceClaim).mockReturnValue({
        mutate: vi.fn(),
        isPending: false,
      } as unknown as ReturnType<typeof useUpdateInsuranceClaim>);

      render(<ClaimDetail claimId="missing_claim" />);

      expect(screen.getByRole("heading", { name: /Claim not found/i })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: /Claim not found/i }).parentElement).toHaveClass(
        "bg-gradient-to-br",
      );
    });

    it("handles claim mutation workflows appropriately", async () => {
      vi.mocked(useAuth).mockReturnValue({
        session: { user: { id: "u_1", email: "a@a.com", role: "BILLING_OFFICER" } }
      } as unknown as ReturnType<typeof useAuth>);

      const mockMutate = vi.fn();
      vi.mocked(useUpdateInsuranceClaim).mockReturnValue({
        mutate: mockMutate,
        isPending: false,
      } as unknown as ReturnType<typeof useUpdateInsuranceClaim>);

      vi.mocked(useInsuranceClaim).mockReturnValue({
        data: {
          id: "claim_1",
          claimNumber: "CLM-123",
          patientId: "pat_1",
          billId: "bill_1",
          providerName: "HealthPlus",
          status: "PENDING",
          submittedAt: "2026-09-10T10:00:00Z",
        },
        isLoading: false,
      } as unknown as ReturnType<typeof useInsuranceClaim>);

      render(<ClaimDetail claimId="claim_1" />);
      
      // Ensure it renders PENDING status
      expect(screen.getByText("Claim: CLM-123")).toBeInTheDocument();
      
      // Click reject
      fireEvent.click(screen.getByText("Reject Claim"));
      
      // Fill out reason
      const reasonInput = screen.getByPlaceholderText(/Enter reason/i);
      fireEvent.change(reasonInput, { target: { value: "Not covered." } });
      
      // Confirm rejection
      fireEvent.click(screen.getByText("Confirm Rejection"));
      
      await waitFor(() => {
        expect(mockMutate).toHaveBeenCalledWith(
          expect.objectContaining({
            id: "claim_1",
            payload: expect.objectContaining({
              status: "REJECTED",
              decisionMessage: "Not covered."
            }),
          }),
          expect.anything()
        );
      });
    });
  });

  describe("DischargeSummaryView", () => {
    it("shows a neutral empty state when no discharge summary exists", () => {
      vi.mocked(useDischarge).mockReturnValue({
        data: [],
        isLoading: false,
      } as unknown as ReturnType<typeof useDischarge>);

      vi.mocked(useDownloadDischargePdf).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as unknown as ReturnType<typeof useDownloadDischargePdf>);

      render(<DischargeSummaryView patientId="pat_1" />);

      expect(screen.getByRole("heading", { name: /No discharge summary found/i })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: /No discharge summary found/i }).parentElement).toHaveClass(
        "bg-gradient-to-br",
      );
    });

    it("renders stay information, lab results, and medications", () => {
      vi.mocked(useDischarge).mockReturnValue({
        data: [{
          id: "ds_1",
          patientId: "pat_1",
          admissionId: "adm_1",
          generatedByUserId: "dr_1",
          generatedAt: "2026-09-12T10:00:00Z",
          status: "FINALIZED",
          staySummary: "Patient recovered fully.",
          labResults: "WBC normal",
          medicationSchedule: "Paracetamol 500mg BID",
        }],
        isLoading: false,
      } as unknown as ReturnType<typeof useDischarge>);

      vi.mocked(useDownloadDischargePdf).mockReturnValue({
        mutateAsync: vi.fn(),
        isPending: false,
      } as unknown as ReturnType<typeof useDownloadDischargePdf>);

      render(<DischargeSummaryView patientId="pat_1" />);
      
      expect(screen.getByText("Patient recovered fully.")).toBeInTheDocument();
      expect(screen.getByText("WBC normal")).toBeInTheDocument();
      expect(screen.getByText("Paracetamol 500mg BID")).toBeInTheDocument();
      expect(screen.getByText("Download PDF")).toBeInTheDocument();
    });
  });
});
