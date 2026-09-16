"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, AlertTriangle, ShieldCheck, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/forms/form-field";
import { Select } from "@/components/ui/select";
import { useAuth } from "@/features/auth/auth-provider";
import { useMedicines, useCreatePrescription, useCheckPrescriptionSafety } from "../hooks/use-pharmacy";
import { usePatients } from "@/features/patients/hooks/use-patients";
import { prescriptionFormSchema, type PrescriptionFormValues } from "../schemas/prescription.schema";
import type { PrescriptionSafetyResult } from "@/contracts/pharmacy";

export function PrescriptionBuilder() {
  const router = useRouter();
  const { session } = useAuth();
  const user = session?.user;
  const { data: medsData } = useMedicines();
  const { data: patientsData } = usePatients();
  const createMutation = useCreatePrescription();
  const checkSafetyMutation = useCheckPrescriptionSafety();

  const [safetyResult, setSafetyResult] = useState<PrescriptionSafetyResult | null>(null);
  const [hasAcknowledgedWarnings, setHasAcknowledgedWarnings] = useState(false);

  const medicines = medsData?.items || [];
  const patients = patientsData?.items || [];

  const { register, control, handleSubmit, watch, formState: { errors } } = useForm<PrescriptionFormValues>({
    resolver: zodResolver(prescriptionFormSchema),
    defaultValues: {
      patientId: "",
      items: [{ medicineId: "", dosage: "", frequency: "", duration: "", instructions: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const selectedPatientId = watch("patientId");
  const selectedPatient = patients.find((p: { id: string }) => p.id === selectedPatientId);

  // Trigger safety check instead of final submit
  const handlePreSubmit = (data: PrescriptionFormValues) => {
    // Re-check safety if meds changed or first time
    const medicineIds = data.items.map(item => item.medicineId);
    
    checkSafetyMutation.mutate(
      { medicineIds },
      {
        onSuccess: (res) => {
          setSafetyResult(res);
          setHasAcknowledgedWarnings(false); // Reset ack on new check
          
          if (res.status === "SAFE") {
            // Automatically proceed to final creation if safe (or you could wait for user to click submit again, but let's require explicit submit)
          }
        },
      }
    );
  };

  const handleFinalSubmit = (data: PrescriptionFormValues) => {
    if (!safetyResult || (!hasAcknowledgedWarnings && safetyResult.status !== "SAFE")) return;

    if (!user) return;

    const mappedItems = data.items.map((item, idx) => {
      const med = medicines.find((m: { id: string, genericName: string, strength: string }) => m.id === item.medicineId);
      return {
        id: `i_${Date.now()}_${idx}`,
        medicineId: item.medicineId,
        medicineDisplay: med ? `${med.genericName} ${med.strength}` : "Unknown Med",
        dosage: item.dosage,
        frequency: item.frequency,
        duration: item.duration,
        instructions: item.instructions,
      };
    });

    createMutation.mutate(
      {
        patientId: data.patientId,
        prescriberUserId: user.id,
        items: mappedItems,
        safetySummary: safetyResult,
      },
      {
        onSuccess: () => {
          router.push("/pharmacy/prescriptions");
        },
      }
    );
  };

  return (
    <form className="space-y-8" onSubmit={handleSubmit(safetyResult ? handleFinalSubmit : handlePreSubmit)}>
      {/* Step 1: Patient Context */}
      <div className="rounded-xl border border-border bg-card shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-slate-900 dark:text-slate-100">
          <User className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          Patient Selection
        </h3>
        
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <FormField id="patientId" label="Select Patient" error={errors.patientId?.message}>
            <Select 
              {...register("patientId")} 
              className="w-full" 
              disabled={!!safetyResult} // Lock patient once safety is checked
            >
              <option value="">-- Choose Patient --</option>
              {patients.map((p: { id: string, patientNumber: string, displayName: string }) => (
                <option key={p.id} value={p.id}>
                  {p.patientNumber} - {p.displayName}
                </option>
              ))}
            </Select>
          </FormField>

          {selectedPatient && (
            <div className="rounded-md bg-indigo-50 dark:bg-indigo-950/30 p-4 border border-indigo-100 dark:border-indigo-900/50">
              <div className="font-semibold text-indigo-900 dark:text-indigo-300 mb-1">{selectedPatient.displayName}</div>
              <div className="text-sm text-indigo-700 dark:text-indigo-400">
                Allergies: {selectedPatient.allergies?.length ? selectedPatient.allergies.join(", ") : "None recorded"}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Step 2: Medication Items */}
      <div className="rounded-xl border border-border bg-card shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Prescription Items</h3>
        </div>

        <div className="space-y-6">
          {fields.map((field, index) => (
            <div key={field.id} className="relative rounded-lg border border-slate-200 dark:border-slate-800 p-4 pt-6 bg-slate-50/50 dark:bg-slate-900/50">
              {fields.length > 1 && !safetyResult && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute top-2 right-2 text-slate-400 hover:text-rose-600 transition-colors"
                  title="Remove medication"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
              
              <div className="grid md:grid-cols-2 gap-4">
                <FormField id={`items.${index}.medicineId`} label="Medication" error={errors.items?.[index]?.medicineId?.message}>
                  <Select {...register(`items.${index}.medicineId` as const)} disabled={!!safetyResult} className="w-full">
                    <option value="">-- Select Medication --</option>
                    {medicines.map((m: { id: string, genericName: string, strength: string, brandName?: string }) => (
                      <option key={m.id} value={m.id}>
                        {m.genericName} {m.brandName ? `(${m.brandName})` : ''} - {m.strength}
                      </option>
                    ))}
                  </Select>
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField id={`items.${index}.dosage`} label="Dosage" error={errors.items?.[index]?.dosage?.message}>
                    <Input {...register(`items.${index}.dosage` as const)} placeholder="e.g. 1 tablet" disabled={!!safetyResult} />
                  </FormField>
                  <FormField id={`items.${index}.frequency`} label="Frequency" error={errors.items?.[index]?.frequency?.message}>
                    <Input {...register(`items.${index}.frequency` as const)} placeholder="e.g. BID" disabled={!!safetyResult} />
                  </FormField>
                </div>

                <FormField id={`items.${index}.duration`} label="Duration" error={errors.items?.[index]?.duration?.message}>
                  <Input {...register(`items.${index}.duration` as const)} placeholder="e.g. 5 days" disabled={!!safetyResult} />
                </FormField>

                <FormField id={`items.${index}.instructions`} label="Instructions (Optional)" error={errors.items?.[index]?.instructions?.message}>
                  <Input {...register(`items.${index}.instructions` as const)} placeholder="Take after food" disabled={!!safetyResult} />
                </FormField>
              </div>
            </div>
          ))}

          {!safetyResult && (
            <Button type="button" variant="outline" onClick={() => append({ medicineId: "", dosage: "", frequency: "", duration: "", instructions: "" })} className="w-full border-dashed">
              <Plus className="mr-2 h-4 w-4" /> Add Medication
            </Button>
          )}
        </div>
      </div>

      {/* Step 3: Safety Result & Acknowledgment */}
      {safetyResult && (
        <div className={`rounded-xl border p-6 ${
          safetyResult.status === "SAFE" 
            ? "border-emerald-200 bg-emerald-50 dark:border-emerald-900/50 dark:bg-emerald-950/20" 
            : "border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/20"
        }`}>
          <div className="flex items-start gap-3">
            {safetyResult.status === "SAFE" ? (
              <ShieldCheck className="h-6 w-6 text-emerald-600 mt-1" />
            ) : (
              <AlertTriangle className="h-6 w-6 text-amber-600 mt-1" />
            )}
            <div className="flex-1">
              <h3 className={`text-lg font-semibold ${safetyResult.status === "SAFE" ? "text-emerald-800 dark:text-emerald-300" : "text-amber-800 dark:text-amber-300"}`}>
                {safetyResult.status === "SAFE" ? "Safety Check: Cleared" : "Safety Check: Warnings Identified"}
              </h3>
              
              {safetyResult.status === "SAFE" ? (
                <p className="mt-2 text-sm text-emerald-700 dark:text-emerald-400">
                  No configured allergy or interaction warnings were returned by the system.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {safetyResult.warnings.map((warning, idx) => (
                    <div key={idx} className="rounded-md bg-white/60 p-3 text-sm text-amber-900 dark:bg-slate-900/50 dark:text-amber-200 shadow-sm border border-amber-100 dark:border-amber-900">
                      <span className="font-semibold uppercase text-xs mr-2 px-1.5 py-0.5 rounded bg-amber-200 dark:bg-amber-800">
                        {warning.severity}
                      </span>
                      {warning.message}
                    </div>
                  ))}
                  
                  <div className="pt-4 border-t border-amber-200 dark:border-amber-800/50">
                    <label className="flex items-center gap-2 text-sm font-medium text-amber-900 dark:text-amber-200 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={hasAcknowledgedWarnings}
                        onChange={(e) => setHasAcknowledgedWarnings(e.target.checked)}
                        className="rounded border-amber-400 text-amber-600 focus:ring-amber-500 h-4 w-4"
                      />
                      I acknowledge these warnings and confirm the clinical necessity of this prescription.
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end gap-4 pt-4 border-t border-border">
        {safetyResult ? (
          <>
            <Button type="button" variant="outline" onClick={() => setSafetyResult(null)} disabled={createMutation.isPending}>
              Edit Prescription
            </Button>
            <Button 
              type="submit" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={createMutation.isPending || (safetyResult.status !== "SAFE" && !hasAcknowledgedWarnings)}
            >
              {createMutation.isPending ? "Creating..." : "Finalize & Sign"}
            </Button>
          </>
        ) : (
          <Button 
            type="submit" 
            className="bg-sky-600 hover:bg-sky-700 text-white"
            disabled={checkSafetyMutation.isPending}
          >
            {checkSafetyMutation.isPending ? "Checking..." : "Review & Check Safety"}
          </Button>
        )}
      </div>
    </form>
  );
}
