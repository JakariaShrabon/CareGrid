"use client";

import React from "react";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-container";
import { useAuth } from "@/features/auth/auth-provider";
import { ReadOnlyPortalTabs } from "@/features/patients/components/read-only-portal/portal-tabs";
import { usePatient, usePatientAdmission } from "@/features/patients/hooks/use-patients";
import { LoadingState } from "@/components/feedback/loading-state";
import { ErrorState } from "@/components/feedback/error-state";
import { Activity, CalendarDays, HeartPulse, MapPin, UserRound } from "lucide-react";
import { unwrapReadOnlyData } from "@/features/patients/utils/read-only-data";
import type { Patient, PatientAdmission } from "@/contracts/patient";

function formatAdmissionStatus(status?: string) {
  if (status === "ADMITTED") return "Currently admitted";
  if (status === "DISCHARGED") return "Discharged";
  if (status === "TRANSFERRED") return "Transferred";
  return "No current admission";
}

function formatDate(date?: string) {
  if (!date) return "Not available";
  return new Date(date).toLocaleDateString();
}

export default function MyCarePage() {
  const { session } = useAuth();
  const user = session?.user;
  
  const patientId = user?.patientId;
  const { data: patientResponse, isLoading: loadingPatient, error: errorPatient } = usePatient(patientId || "");
  const { data: admissionResponse, isLoading: loadingAdmission } = usePatientAdmission(patientId || "");

  if (!patientId) {
    return (
      <PageContainer>
        <PageHeader title="My Care" />
        <ErrorState title="Access Denied" description="Your account is not linked to a patient profile." />
      </PageContainer>
    );
  }

  if (loadingPatient || loadingAdmission) {
    return (
      <PageContainer>
        <PageHeader title="My Care" />
        <ReadOnlyPortalTabs basePath="/my-care" />
        <LoadingState label="Loading patient details..." />
      </PageContainer>
    );
  }

  const patient = unwrapReadOnlyData<Patient>(patientResponse as Patient | { data?: Patient } | undefined);
  const admission = unwrapReadOnlyData<PatientAdmission>(
    admissionResponse as PatientAdmission | { data?: PatientAdmission } | undefined,
  );

  if (errorPatient || !patient) {
    return (
      <PageContainer>
        <PageHeader title="My Care" />
        <ReadOnlyPortalTabs basePath="/my-care" />
        <ErrorState title="Error" description="Could not load your care context." />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        eyebrow="Read-only portal"
        title="My Care"
        description={`Welcome back, ${patient.firstName}. Review your current care context and shared hospital updates.`}
      />
      
      <ReadOnlyPortalTabs basePath="/my-care" />
      
      <section className="overflow-hidden rounded-lg border border-cyan-100/80 bg-gradient-to-br from-white via-cyan-50/50 to-emerald-50/40 shadow-sm">
        <div className="border-b border-cyan-100/80 p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-800 text-white shadow-sm shadow-cyan-800/20">
                <UserRound className="h-5 w-5" aria-hidden />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">Patient profile</p>
                <h2 className="text-2xl font-semibold text-slate-950">{patient.displayName}</h2>
              </div>
            </div>
            <span className="inline-flex w-fit items-center rounded-full border border-cyan-200 bg-white px-3 py-1 text-sm font-semibold text-cyan-800">
              Read-only care view
            </span>
          </div>
        </div>

        <div className="grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-4 sm:p-6">
          <div className="rounded-lg border border-cyan-100/80 bg-white/80 p-4 shadow-sm">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
              <HeartPulse className="h-4 w-4" aria-hidden />
            </div>
            <p className="text-sm text-muted-foreground">Admission status</p>
            <p className="mt-1 text-base font-semibold text-slate-950">{formatAdmissionStatus(admission?.status)}</p>
          </div>
          <div className="rounded-lg border border-cyan-100/80 bg-white/80 p-4 shadow-sm">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-cyan-50 text-cyan-700">
              <CalendarDays className="h-4 w-4" aria-hidden />
            </div>
            <p className="text-sm text-muted-foreground">Admission date</p>
            <p className="mt-1 text-base font-semibold text-slate-950">{formatDate(admission?.admittedAt)}</p>
          </div>
          <div className="rounded-lg border border-cyan-100/80 bg-white/80 p-4 shadow-sm">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-sky-50 text-sky-700">
              <MapPin className="h-4 w-4" aria-hidden />
            </div>
            <p className="text-sm text-muted-foreground">Room / Bed</p>
            <p className="mt-1 text-base font-semibold text-slate-950">
              {admission ? `${admission.roomId} / ${admission.bedId}` : "Not assigned"}
            </p>
          </div>
          <div className="rounded-lg border border-cyan-100/80 bg-white/80 p-4 shadow-sm">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-indigo-50 text-indigo-700">
              <Activity className="h-4 w-4" aria-hidden />
            </div>
            <p className="text-sm text-muted-foreground">Blood group</p>
            <p className="mt-1 text-base font-semibold text-slate-950">{patient.bloodGroup || "Unknown"}</p>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
