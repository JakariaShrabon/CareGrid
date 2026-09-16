"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreatePatientUpdate } from "@/features/patients/hooks/use-patients";
import { FormField } from "@/components/forms/form-field";

// Note: The DailyPatientUpdate contract includes a `visibility` field for future
// Family Portal consumption. The Phase 4 UI defaults to "STAFF" without exposing
// this choice to the user – visibility is a system-level concern until the Family
// Portal is built in a later phase.
const updateSchema = z.object({
  content: z.string().min(5, "Update content must be at least 5 characters long"),
});

type UpdateFormValues = z.infer<typeof updateSchema>;

export function CreateUpdateForm({
  patientId,
  admissionId,
  onSuccess,
  onCancel,
}: {
  patientId: string;
  admissionId?: string;
  onSuccess: () => void;
  onCancel: () => void;
}) {
  const { mutate: createUpdate, isPending } = useCreatePatientUpdate();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateFormValues>({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = (data: UpdateFormValues) => {
    setError(null);
    createUpdate(
      {
        id: patientId,
        payload: {
          content: data.content,
          // Default visibility to STAFF; the Family Portal (Phase N) will
          // surface FAMILY-visible updates via its own read-only interface.
          visibility: "STAFF",
          admissionId,
          authorUserId: "currentUser", // Will be replaced by real auth session
          authorRole: "NURSE",
        },
      },
      {
        onSuccess: () => {
          onSuccess();
        },
        onError: (err) => {
          setError(err.message || "Failed to post update. Please try again.");
        },
      }
    );
  };

  return (
    <div className="rounded-lg border border-cyan-100/80 bg-gradient-to-br from-white via-cyan-50/50 to-emerald-50/40 p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900">New Daily Update</h3>
        <p className="text-sm text-muted-foreground">Add a clinical update for this patient.</p>
      </div>

      {error && (
        <div className="mb-6 rounded-md bg-red-50 p-3 text-sm text-red-700 ring-1 ring-inset ring-red-600/20">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormField id="update-content" label="Update Content" error={errors.content?.message}>
          <textarea
            id="update-content"
            {...register("content")}
            rows={4}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="Enter clinical observations, progress, or relevant notes..."
          />
        </FormField>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
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
            {isPending ? "Posting..." : "Post Update"}
          </button>
        </div>
      </form>
    </div>
  );
}
