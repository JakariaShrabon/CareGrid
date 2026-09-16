"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { useAuth } from "@/features/auth/auth-provider";
import { getSafeReturnUrl } from "@/lib/auth/safe-redirect";
import { getApiEnvironment } from "@/lib/api/environment";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert } from "@/components/feedback/alert";
import { FormField } from "@/components/forms/form-field";
import { DEMO_USERS, DEMO_PASSWORD } from "@/mocks/data/demo-users";

const loginSchema = z.object({
  identifier: z.string().min(1, "Identifier is required").email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  
  const [showPassword, setShowPassword] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
      rememberMe: false,
    },
  });

  const isMockMode = getApiEnvironment().mode === "mock";

  async function onSubmit(data: LoginFormData) {
    setGlobalError(null);
    try {
      const newSession = await login(data);
      const returnTo = searchParams.get("returnTo");
      
      let redirectUrl = getSafeReturnUrl(returnTo);
      if (redirectUrl === "/dashboard") {
        if (newSession.user?.role === "PATIENT") {
          redirectUrl = "/my-care";
        } else if (newSession.user?.role === "FAMILY_ATTENDANT") {
          redirectUrl = "/family-care";
        }
      }
      
      router.push(redirectUrl);
    } catch (error) {
      setGlobalError(error instanceof Error ? error.message : "An unexpected error occurred.");
    }
  }

  return (
    <>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {globalError && (
          <Alert tone="critical" title="Login failed">
            {globalError}
          </Alert>
        )}

        <FormField id="identifier" label="Email / Staff ID" error={form.formState.errors.identifier?.message}>
          <Input
            id="identifier"
            {...form.register("identifier")}
            type="email"
            placeholder="name@caregrid.demo"
            autoComplete="email"
            disabled={form.formState.isSubmitting}
          />
        </FormField>

        <FormField id="password" label="Password" error={form.formState.errors.password?.message}>
          <div className="relative">
            <Input
              id="password"
              {...form.register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={form.formState.isSubmitting}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </FormField>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rememberMe"
              {...form.register("rememberMe")}
              disabled={form.formState.isSubmitting}
            />
            <label
              htmlFor="rememberMe"
              className="text-sm font-medium leading-none text-slate-600 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Remember me
            </label>
          </div>
          <Link
            href="/forgot-password"
            className="text-sm font-medium text-primary hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
      </form>

      {isMockMode && (
        <div className="mt-8 rounded-md bg-amber-50 p-4 border border-amber-200">
          <h3 className="text-sm font-medium text-amber-800 mb-2">Development Helpers</h3>
          <p className="text-xs text-amber-700 mb-3">Click a role to fill the form automatically.</p>
          <div className="flex flex-wrap gap-2">
            {Object.values(DEMO_USERS).map((user) => (
              <Button
                key={user.id}
                variant="outline"
                size="sm"
                className="h-7 text-xs bg-white text-amber-700 border-amber-200 hover:bg-amber-100 hover:text-amber-900"
                onClick={() => {
                  form.setValue("identifier", user.email);
                  form.setValue("password", DEMO_PASSWORD);
                }}
                type="button"
              >
                {user.role.replaceAll("_", " ")}
              </Button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-sm shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">Sign In</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access CareGrid
          </p>
        </CardHeader>
        <CardContent>
          <Suspense fallback={
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          }>
            <LoginForm />
          </Suspense>
          <div className="mt-6 border-t border-slate-200 pt-5 text-center">
            <p className="text-sm text-slate-600">Don&apos;t have an account?</p>
            <Button variant="outline" asChild className="mt-3 h-10 bg-white">
              <Link href="/register">Create Account</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
