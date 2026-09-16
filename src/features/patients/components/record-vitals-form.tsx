"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreatePatientVital } from "@/features/patients/hooks/use-patients";
import { useAuth } from "@/features/auth/auth-provider";
import { FormField } from "@/components/forms/form-field";
import type { Patient } from "@/contracts/patient";

const vitalsSchema = z.object({
  temperatureCelsius: z.number().min(30, "Value must be between 30 and 45").max(45, "Value must be between 30 and 45"),
  systolicBp: z.number().min(50, "Value must be between 50 and 250").max(250, "Value must be between 50 and 250"),
  diastolicBp: z.number().min(30, "Value must be between 30 and 150").max(150, "Value must be between 30 and 150"),
  oxygenSaturationPercent: z.number().min(0, "Value must be 0–100").max(100, "Value must be 0–100"),
  note: z.string().optional(),
});

type VitalsFormValues = z.infer<typeof vitalsSchema>;

export function RecordVitalsForm({
  patient,
  admissionId,
  onSuccess,
  onCancel,
}: {
  patient: Patient;
  admissionId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const { mutate: createVital, isPending, error: mutationError } = useCreatePatientVital();
  const { session } = useAuth();

  // Focus the first input on mount is handled via autoFocus on the input element

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onCancel]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VitalsFormValues>({
    resolver: zodResolver(vitalsSchema),
    defaultValues: {
      temperatureCelsius: 37.0,
      systolicBp: 120,
      diastolicBp: 80,
      oxygenSaturationPercent: 98,
      note: "",
    },
  });

  const onSubmit = (data: VitalsFormValues) => {
    createVital(
      {
        id: patient.id,
        payload: {
          ...data,
          admissionId,
          recordedByUserId: session?.user?.id ?? "unknown",
        },
      },
      {
        onSuccess: () => onSuccess(),
      }
    );
  };

  const errorMessage =
    mutationError instanceof Error
      ? mutationError.message
      : mutationError
        ? "Failed to record vitals. Please try again."
        : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="record-vitals-title"
      className="rounded-lg border border-cyan-100/80 bg-gradient-to-br from-white via-cyan-50/50 to-emerald-50/40 p-6 shadow-xl"
    >
      {/* Patient identity — always visible inside the dialog */}
      <div className="mb-5 rounded-md border border-sky-100 bg-sky-50 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-sky-600">Recording vitals for</p>
        <p className="mt-0.5 text-base font-semibold text-slate-900">{patient.displayName}</p>
        <p className="text-sm text-slate-600">{patient.patientNumber}</p>
      </div>

      <h2 id="record-vitals-title" className="mb-1 text-lg font-semibold text-slate-900">
        Record Vitals
      </h2>
      <p className="mb-6 text-sm text-muted-foreground">Enter current measurements. All fields are required.</p>

      {errorMessage && (
        <div role="alert" className="mb-6 rounded-md bg-red-50 p-3 text-sm text-red-700 ring-1 ring-inset ring-red-600/20">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField id="temp" label="Temperature (°C)" error={errors.temperatureCelsius?.message}>
            <input
              id="temp"
              type="number"
              step="0.1"
              {...register("temperatureCelsius", { valueAsNumber: true })}
              autoFocus
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              aria-describedby={errors.temperatureCelsius ? "temp-error" : undefined}
            />
          </FormField>

          <FormField id="spo2" label="Oxygen Saturation (%)" error={errors.oxygenSaturationPercent?.message}>
            <input
              id="spo2"
              type="number"
              {...register("oxygenSaturationPercent", { valueAsNumber: true })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              aria-describedby={errors.oxygenSaturationPercent ? "spo2-error" : undefined}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField id="sys-bp" label="Systolic BP (mmHg)" error={errors.systolicBp?.message}>
            <input
              id="sys-bp"
              type="number"
              {...register("systolicBp", { valueAsNumber: true })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              aria-describedby={errors.systolicBp ? "sys-bp-error" : undefined}
            />
          </FormField>

          <FormField id="dia-bp" label="Diastolic BP (mmHg)" error={errors.diastolicBp?.message}>
            <input
              id="dia-bp"
              type="number"
              {...register("diastolicBp", { valueAsNumber: true })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              aria-describedby={errors.diastolicBp ? "dia-bp-error" : undefined}
            />
          </FormField>
        </div>

        <FormField id="note" label="Clinical Note (Optional)" error={errors.note?.message}>
          <textarea
            id="note"
            {...register("note")}
            rows={3}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Any additional observations..."
          />
        </FormField>

        <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save Vitals"}
          </button>
        </div>
      </form>
    </div>
  );
}
