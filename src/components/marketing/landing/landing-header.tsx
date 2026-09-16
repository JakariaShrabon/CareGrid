import Link from "next/link";

import { Button } from "@/components/ui/button";

export function LandingHeader() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-slate-200/70 bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-6">
        <Link
          href="/"
          className="inline-flex min-w-0 items-center gap-2 text-xs font-semibold text-slate-950 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-white sm:gap-3 sm:text-sm"
        >
          <span
            aria-hidden="true"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-teal-200 bg-teal-50 text-sm font-bold tracking-normal text-primary shadow-sm"
          >
            C
          </span>
          <span className="whitespace-nowrap">CAREGRID.IO</span>
        </Link>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            asChild
            className="h-10 whitespace-nowrap border-teal-200 bg-teal-50/70 px-3 text-xs text-primary shadow-sm transition hover:border-teal-300 hover:bg-teal-100 active:scale-[0.98] sm:px-4 sm:text-sm"
          >
            <Link href="/register">Create Account</Link>
          </Button>
          <Button
            variant="outline"
            asChild
            className="h-10 whitespace-nowrap border-slate-300 bg-white/80 px-3 text-xs text-slate-700 shadow-sm transition hover:border-teal-300 hover:bg-teal-50 hover:text-primary active:scale-[0.98] sm:px-4 sm:text-sm"
          >
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
