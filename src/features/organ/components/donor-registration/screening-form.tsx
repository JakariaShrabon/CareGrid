/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { AlertTriangle, ChevronLeft, Loader2, Send } from "lucide-react";

import { Button } from "@/components/ui/button";

import Link from "next/link";
import { useRegisterLivingDonor } from "../../hooks/use-organ";

const screeningSchema = z.object({
  consentSubmit: z.boolean().refine(val => val === true, "You must consent to submit this information."),
  confirmAccuracy: z.boolean().refine(val => val === true, "You must confirm the information is accurate."),
  willingToContact: z.boolean().refine(val => val === true, "You must be willing to be contacted."),
});

type ScreeningFormData = z.infer<typeof screeningSchema>;

export function DonorScreeningForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const organ = searchParams.get("organ");
  const bg = searchParams.get("bg");

  const { register, handleSubmit, formState: { errors } } = useForm<ScreeningFormData>({
    resolver: zodResolver(screeningSchema),
  });

  const { mutate, isPending, error } = useRegisterLivingDonor();

  const onSubmit = (data: ScreeningFormData) => {
    if (!organ) return;
    
    mutate({
      organInterest: organ,
      bloodGroup: bg || undefined
    }, {
      onSuccess: (res) => {
        const ref = (res as any).anonymousReference;
        router.push(`/donor/success?ref=${ref}`);
      }
    });
  };

  if (!organ) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 text-center">
        <p className="mb-4">Missing registration data. Please start over.</p>
        <Button asChild><Link href="/donor">Start Registration</Link></Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4 -ml-4 text-muted-foreground hover:text-foreground">
          <Link href="/donor/register">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Details
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Eligibility Screening</h1>
      </div>

      <div className="mb-8 p-4 border border-amber-500/20 bg-amber-500/10 rounded-lg flex gap-3 text-amber-800"><AlertTriangle className="h-5 w-5" /><div><strong className="block mb-1">Demonstration Checklist</strong>This demonstration screening checklist is for project workflow purposes and does not constitute medical eligibility or transplant approval. Real-world screening involves extensive medical questionnaires and lab testing.</div></div>

      {error && (
        <div className="mb-6 p-4 border border-destructive/20 bg-destructive/10 rounded-lg text-destructive">Failed to submit registration. Please try again later.</div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-card p-6 md:p-8 rounded-xl border shadow-sm">
        
        <div className="space-y-4">
          <label className="flex items-start gap-3 p-3 rounded-md border bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
            <input 
              type="checkbox" 
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              {...register("consentSubmit")}
            />
            <div className="flex-1 text-sm">
              <span className="font-medium text-foreground block">Consent to Submit</span>
              <span className="text-muted-foreground">I consent to submit this information for preliminary screening review by CareGrid staff.</span>
            </div>
          </label>
          {errors.consentSubmit && <p className="text-sm text-destructive font-medium px-1">{errors.consentSubmit.message}</p>}

          <label className="flex items-start gap-3 p-3 rounded-md border bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
            <input 
              type="checkbox" 
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              {...register("confirmAccuracy")}
            />
            <div className="flex-1 text-sm">
              <span className="font-medium text-foreground block">Confirm Accuracy</span>
              <span className="text-muted-foreground">I confirm that I am providing this information truthfully and without external coercion.</span>
            </div>
          </label>
          {errors.confirmAccuracy && <p className="text-sm text-destructive font-medium px-1">{errors.confirmAccuracy.message}</p>}

          <label className="flex items-start gap-3 p-3 rounded-md border bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
            <input 
              type="checkbox" 
              className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              {...register("willingToContact")}
            />
            <div className="flex-1 text-sm">
              <span className="font-medium text-foreground block">Willingness to Review</span>
              <span className="text-muted-foreground">I am willing to be contacted by a transplant coordinator if my preliminary screening indicates potential matching.</span>
            </div>
          </label>
          {errors.willingToContact && <p className="text-sm text-destructive font-medium px-1">{errors.willingToContact.message}</p>}
        </div>

        <div className="pt-4 flex justify-end border-t">
          <Button type="submit" size="default" disabled={isPending} className="w-full md:w-auto">
            {isPending ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
            ) : (
              <><Send className="mr-2 h-4 w-4" /> Submit Registration</>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
