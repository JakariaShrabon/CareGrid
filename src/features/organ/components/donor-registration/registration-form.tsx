/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowRight, ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";

import Link from "next/link";

const registerSchema = z.object({
  bloodGroup: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", ""], {
    message: "Please select a valid blood group."
  }).optional(),
  organInterest: z.enum(["KIDNEY", "LIVER", "HEART", "LUNG", "PANCREAS", "CORNEA"], {
    message: "Please select the organ you wish to donate."
  }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function DonorRegistrationForm() {
  const router = useRouter();
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterFormData) => {
    const params = new URLSearchParams({
      organ: data.organInterest,
    });
    if (data.bloodGroup) {
      params.append("bg", data.bloodGroup);
    }
    router.push(`/donor/screening?${params.toString()}`);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4 -ml-4 text-muted-foreground hover:text-foreground">
          <Link href="/donor">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Overview
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">Registration Details</h1>
        <p className="mt-2 text-muted-foreground">
          Please provide the basic information below. No personal identifying information (PII) is required at this stage.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-card p-6 md:p-8 rounded-xl border shadow-sm">
        <div className="space-y-2">
          <label htmlFor="organInterest" className="text-sm font-medium leading-none">Organ Interest *</label>
          <select
            id="organInterest"
            {...register("organInterest")}
            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select an organ...</option>
            <option value="KIDNEY">Kidney</option>
            <option value="LIVER">Liver</option>
            <option value="HEART">Heart</option>
            <option value="LUNG">Lung</option>
            <option value="PANCREAS">Pancreas</option>
            <option value="CORNEA">Cornea</option>
          </select>
          {errors.organInterest?.message && <p className="text-sm text-destructive">{errors.organInterest.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="bloodGroup" className="text-sm font-medium leading-none">Blood Group (Optional)</label>
          <select
            id="bloodGroup"
            {...register("bloodGroup")}
            className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">I don&apos;t know / Prefer not to say</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
          <p className="text-xs text-muted-foreground mt-2">
            If you know your blood group, providing it helps our system assess preliminary matching potential faster.
          </p>
          {errors.bloodGroup?.message && <p className="text-sm text-destructive">{errors.bloodGroup.message}</p>}
        </div>

        <div className="pt-4 flex justify-end border-t">
          <Button type="submit" className="w-full md:w-auto">
            Continue to Screening
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}
