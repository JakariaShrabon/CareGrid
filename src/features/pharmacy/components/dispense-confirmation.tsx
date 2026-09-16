"use client";

import { X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePharmacyInventory, useDispensePrescription } from "../hooks/use-pharmacy";
import { useAuth } from "@/features/auth/auth-provider";
import type { Prescription } from "@/contracts/pharmacy";

interface DispenseConfirmationProps {
  open: boolean;
  prescription: Prescription;
  onCancel: () => void;
  onSuccess: () => void;
}

export function DispenseConfirmation({
  open,
  prescription,
  onCancel,
  onSuccess,
}: DispenseConfirmationProps) {
  const { session } = useAuth();
  const user = session?.user;
  const { data: invData, isLoading } = usePharmacyInventory();
  const dispenseMutation = useDispensePrescription();

  if (!open) return null;

  const inventory = invData?.items || [];
  
  // Cross reference prescription items with inventory
  const stockPrecheck = prescription.items.map((item) => {
    const invItem = inventory.find(i => i.medicineId === item.medicineId);
    return {
      ...item,
      availableQuantity: invItem?.availableQuantity || 0,
      status: invItem?.status || "CRITICAL",
    };
  });

  const hasInsufficientStock = stockPrecheck.some(item => item.availableQuantity < 1);

  const handleDispense = () => {
    if (!user) return;
    dispenseMutation.mutate(
      {
        prescriptionId: prescription.id,
        dispensedByUserId: user.id,
      },
      {
        onSuccess: () => {
          onSuccess();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-lg rounded-lg bg-white p-5 shadow-xl dark:bg-slate-900"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-950 dark:text-slate-50">
              Confirm Dispense
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Verify stock availability before dispensing this prescription.
            </p>
          </div>
          <Button variant="ghost" size="icon" aria-label="Close dialog" onClick={onCancel}>
            <X className="h-4 w-4" aria-hidden />
          </Button>
        </div>

        <div className="mt-6 space-y-4">
          <div className="rounded-md border border-border bg-slate-50 p-4 dark:bg-slate-800/50">
            <h3 className="mb-2 text-sm font-medium text-slate-900 dark:text-slate-100">Prescription Items ({prescription.items.length})</h3>
            <ul className="space-y-3">
              {stockPrecheck.map((item) => (
                <li key={item.id} className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{item.medicineDisplay}</span>
                    <div className="text-xs text-slate-500">{item.dosage} • {item.frequency}</div>
                  </div>
                  <div className={`font-semibold ${item.availableQuantity > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                    Stock: {item.availableQuantity}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {hasInsufficientStock && (
            <div className="flex items-start gap-2 rounded-md bg-rose-50 p-3 text-sm text-rose-800 dark:bg-rose-950/50 dark:text-rose-300">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p>One or more items have insufficient stock. Dispensing may be restricted.</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={onCancel} disabled={dispenseMutation.isPending}>
            Cancel
          </Button>
          <Button 
            onClick={handleDispense} 
            disabled={dispenseMutation.isPending || hasInsufficientStock || isLoading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {dispenseMutation.isPending ? "Dispensing..." : "Confirm Dispense"}
          </Button>
        </div>
      </div>
    </div>
  );
}
