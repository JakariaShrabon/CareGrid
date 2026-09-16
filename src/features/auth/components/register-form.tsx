"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import type { AuthSession, PublicRegistrationRole, RegisterAccountRequest } from "@/contracts/auth";
import { Alert } from "@/components/feedback/alert";
import { FormField } from "@/components/forms/form-field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { authService } from "@/lib/auth/auth-service";
import { cn } from "@/lib/utils/cn";

const accountTypes = [
  {
    role: "PATIENT",
    label: "Patient",
    description: "Access your permitted care updates and discharge information.",
  },
  {
    role: "FAMILY_ATTENDANT",
    label: "Family Attendant",
    description: "Access permitted updates for a linked patient.",
  },
] as const satisfies readonly {
  role: PublicRegistrationRole;
  label: string;
  description: string;
}[];

const registerSchema = z
  .object({
    name: z.string().trim().min(1, "Full name is required"),
    email: z.string().trim().email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
    role: z.enum(["PATIENT", "FAMILY_ATTENDANT"], {
      error: "Choose Patient or Family Attendant",
    }),
    consent: z.boolean().refine((value) => value, {
      message: "You must agree to the demo account terms",
    }),
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm({
  onRegistered,
  registerAccount = authService.register,
}: {
  onRegistered?: (session: AuthSession) => void;
  registerAccount?: (request: RegisterAccountRequest) => Promise<AuthSession>;
}) {
  const [globalError, setGlobalError] = useState<string | null>(null);
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "PATIENT",
      consent: false,
    },
  });
  const selectedRole = form.watch("role");

  async function onSubmit(data: RegisterFormData) {
    setGlobalError(null);
    try {
      const session = await registerAccount({
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
        role: data.role,
      });
      onRegistered?.(session);
    } catch (error) {
      setGlobalError(error instanceof Error ? error.message : "Unable to create account.");
    }
  }

  return (
    <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {globalError ? (
        <Alert tone="critical" title="Account creation failed">
          {globalError}
        </Alert>
      ) : null}

      <FormField id="name" label="Full Name" error={form.formState.errors.name?.message}>
        <Input
          id="name"
          {...form.register("name")}
          autoComplete="name"
          disabled={form.formState.isSubmitting}
          aria-invalid={!!form.formState.errors.name}
        />
      </FormField>

      <FormField id="email" label="Email" error={form.formState.errors.email?.message}>
        <Input
          id="email"
          {...form.register("email")}
          type="email"
          autoComplete="email"
          placeholder="name@caregrid.demo"
          disabled={form.formState.isSubmitting}
          aria-invalid={!!form.formState.errors.email}
        />
      </FormField>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          id="password"
          label="Password"
          error={form.formState.errors.password?.message}
        >
          <Input
            id="password"
            {...form.register("password")}
            type="password"
            autoComplete="new-password"
            disabled={form.formState.isSubmitting}
            aria-invalid={!!form.formState.errors.password}
          />
        </FormField>

        <FormField
          id="confirmPassword"
          label="Confirm Password"
          error={form.formState.errors.confirmPassword?.message}
        >
          <Input
            id="confirmPassword"
            {...form.register("confirmPassword")}
            type="password"
            autoComplete="new-password"
            disabled={form.formState.isSubmitting}
            aria-invalid={!!form.formState.errors.confirmPassword}
          />
        </FormField>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium text-slate-900">Account Type</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {accountTypes.map((accountType) => (
            <label
              key={accountType.role}
              className={cn(
                "flex cursor-pointer gap-3 rounded-lg border bg-white p-3 text-left transition hover:border-teal-300 hover:bg-teal-50/60",
                selectedRole === accountType.role
                  ? "border-teal-300 ring-2 ring-teal-100"
                  : "border-slate-200",
              )}
            >
              <input
                type="radio"
                value={accountType.role}
                {...form.register("role")}
                className="mt-1 h-4 w-4 accent-primary focus-visible:ring-2 focus-visible:ring-ring"
                disabled={form.formState.isSubmitting}
              />
              <span>
                <span className="block text-sm font-semibold text-slate-900">
                  {accountType.label}
                </span>
                <span className="mt-1 block text-xs leading-5 text-slate-600">
                  {accountType.description}
                </span>
              </span>
            </label>
          ))}
        </div>
        {form.formState.errors.role?.message ? (
          <p className="text-sm font-medium text-red-700">
            {form.formState.errors.role.message}
          </p>
        ) : null}
        <p className="text-xs leading-5 text-muted-foreground">
          Hospital staff accounts are provided by the hospital.
        </p>
      </fieldset>

      <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
        <Checkbox
          id="consent"
          {...form.register("consent")}
          disabled={form.formState.isSubmitting}
          aria-invalid={!!form.formState.errors.consent}
          className="mt-0.5"
        />
        <div>
          <label htmlFor="consent" className="text-sm font-medium text-slate-900">
            I agree to the demo/project account terms
          </label>
          <p className="mt-1 text-xs leading-5 text-slate-600">
            This creates a demo auth account only. Clinical records and family links
            are assigned by the hospital.
          </p>
          {form.formState.errors.consent?.message ? (
            <p className="mt-1 text-sm font-medium text-red-700">
              {form.formState.errors.consent.message}
            </p>
          ) : null}
        </div>
      </div>

      <Button type="submit" className="h-11 w-full" disabled={form.formState.isSubmitting}>
        {form.formState.isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
}
