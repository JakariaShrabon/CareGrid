"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, ArrowLeft } from "lucide-react";

import { authService } from "@/lib/auth/auth-service";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Alert } from "@/components/feedback/alert";
import { FormField } from "@/components/forms/form-field";

const forgotPasswordSchema = z.object({
  identifier: z.string().min(1, "Identifier is required").email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      identifier: "",
    },
  });

  async function onSubmit(data: ForgotPasswordFormData) {
    setGlobalError(null);
    setIsSuccess(false);
    try {
      await authService.requestPasswordReset(data.identifier);
      setIsSuccess(true);
    } catch (error) {
      setGlobalError(error instanceof Error ? error.message : "Failed to request password reset.");
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Reset Password</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your email to receive recovery instructions.
          </p>
        </CardHeader>
        <CardContent>
          {isSuccess ? (
            <div className="space-y-4">
              <Alert tone="success" title="Instructions sent">
                If an account matches that information, reset instructions have been prepared and sent.
              </Alert>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/login">Return to Sign In</Link>
              </Button>
            </div>
          ) : (
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {globalError && (
                <Alert tone="critical" title="Error">
                  {globalError}
                </Alert>
              )}

              <FormField id="identifier" label="Email address" error={form.formState.errors.identifier?.message}>
                <Input
                  id="identifier"
                  {...form.register("identifier")}
                  type="email"
                  placeholder="name@caregrid.demo"
                  autoComplete="email"
                  disabled={form.formState.isSubmitting}
                />
              </FormField>

              <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending instructions...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>

              <div className="text-center mt-4">
                <Link
                  href="/login"
                  className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-primary"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
