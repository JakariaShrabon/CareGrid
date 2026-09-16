"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateBloodSos } from "../hooks/use-blood-bank";
import { Alert } from "@/components/feedback/alert";
import { FormField } from "@/components/forms/form-field";
import { ConfirmDialog } from "@/components/ui/dialog";
import { Activity } from "lucide-react";

const sosSchema = z.object({
  bloodGroup: z.enum(["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"]),
  component: z.enum(["WHOLE_BLOOD", "RBC", "PLATELETS", "PLASMA"]),
  requiredUnits: z.number().min(1, "At least 1 unit is required"),
  urgency: z.enum(["HIGH", "CRITICAL"]),
  reason: z.string().min(5, "Reason is required"),
});

type SosFormValues = z.infer<typeof sosSchema>;

export function CreateSosForm({ onSuccess }: { onSuccess?: () => void }) {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingValues, setPendingValues] = useState<SosFormValues | null>(null);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<SosFormValues>({
    resolver: zodResolver(sosSchema),
    defaultValues: {
      requiredUnits: 1,
      urgency: "HIGH",
    },
  });

  const { mutate: createSos, isPending, error: mutationError } = useCreateBloodSos();

  const handleReviewRequest = (values: SosFormValues) => {
    setPendingValues(values);
    setShowConfirmation(true);
  };

  const handleConfirmAndBroadcast = () => {
    if (!pendingValues) return;
    
    // Calculate requiredBy (e.g. 4 hours for high, 1 hour for critical)
    const hours = pendingValues.urgency === "CRITICAL" ? 1 : 4;
    const requiredBy = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
    
    createSos({
      ...pendingValues,
      hospitalId: "HOSPITAL-1", // hardcode mock hospital
      requiredBy,
    }, {
      onSuccess: () => {
        setShowConfirmation(false);
        reset();
        onSuccess?.();
      }
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleReviewRequest)} className="space-y-6 rounded-xl border border-cyan-100/80 bg-gradient-to-br from-white via-rose-50/40 to-cyan-50/40 p-6 shadow-sm">
        <div className="flex items-center gap-3 border-b border-border pb-4 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-100 text-rose-600">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Initiate Emergency SOS</h2>
            <p className="text-sm text-slate-500">Broadcast shortage alert to matched eligible donors</p>
          </div>
        </div>

        {mutationError && (
          <Alert tone="critical" title="Failed to broadcast SOS">
            {mutationError instanceof Error ? mutationError.message : "Unknown error occurred"}
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField id="bloodGroup" label="Required Blood Group" error={errors.bloodGroup?.message as string}>
            <select 
              id="bloodGroup"
              {...register("bloodGroup")}
              className="w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            >
              <option value="">Select Group...</option>
              {["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
          </FormField>
          
          <FormField id="component" label="Blood Component" error={errors.component?.message as string}>
            <select 
              id="component"
              {...register("component")}
              className="w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            >
              <option value="">Select Component...</option>
              <option value="WHOLE_BLOOD">Whole Blood</option>
              <option value="RBC">Red Blood Cells</option>
              <option value="PLATELETS">Platelets</option>
              <option value="PLASMA">Plasma</option>
            </select>
          </FormField>
          
          <FormField id="requiredUnits" label="Required Units" error={errors.requiredUnits?.message as string}>
            <input 
              id="requiredUnits"
              type="number"
              min="1"
              {...register("requiredUnits", { valueAsNumber: true })}
              className="w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
            />
          </FormField>

          <FormField id="urgency" label="Clinical Urgency" error={errors.urgency?.message as string}>
            <select 
              id="urgency"
              {...register("urgency")}
              className="w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none bg-rose-50 text-rose-900 border-rose-200"
            >
              <option value="HIGH">HIGH - Fulfill within 4 hours</option>
              <option value="CRITICAL">CRITICAL - Fulfill within 1 hour</option>
            </select>
          </FormField>
        </div>

        <FormField id="reason" label="Emergency Clinical Context (Reason)" error={errors.reason?.message as string}>
          <textarea 
            id="reason"
            {...register("reason")}
            rows={3}
            className="w-full rounded-md border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
            placeholder="e.g. Mass casualty incident, urgent trauma surgery"
          />
        </FormField>

        <div className="flex justify-end pt-4">
          <button 
            type="submit"
            className="rounded-md bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600 flex items-center gap-2 transition-colors"
          >
            <Activity className="h-4 w-4" />
            Review SOS Broadcast
          </button>
        </div>
      </form>

      {pendingValues && (
        <ConfirmDialog
          open={showConfirmation}
          title="High-Impact Action: Emergency SOS"
          description={`You are about to dispatch an emergency SMS and Email broadcast to matched eligible donors. Requirements: ${pendingValues.requiredUnits} Units of ${pendingValues.bloodGroup} ${pendingValues.component} with urgency ${pendingValues.urgency}. Reason: ${pendingValues.reason}`}
          confirmLabel={isPending ? "Broadcasting..." : "Confirm Emergency SOS"}
          cancelLabel="Cancel"
          onConfirm={handleConfirmAndBroadcast}
          onCancel={() => !isPending && setShowConfirmation(false)}
        />
      )}
    </>
  );
}
