import Link from "next/link";
import { ArrowRight, CircleDot, Layers3, UsersRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CareGridPreview } from "@/components/marketing/landing/caregrid-preview";

const trustSignals = [
  {
    label: "Role-based access",
    Icon: Layers3,
  },
  {
    label: "Coordinated workflows",
    Icon: CircleDot,
  },
  {
    label: "Patient-centered context",
    Icon: UsersRound,
  },
];

export function LandingHero() {
  return (
    <section className="relative mx-auto flex min-h-[calc(100dvh-4rem)] max-w-6xl items-center px-5 py-8 sm:px-6 md:py-10">
      <div className="grid w-full items-center gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(360px,0.85fr)] lg:gap-14">
        <div className="max-w-2xl">
          <p className="animate-landing-fade-in inline-flex items-center rounded-full border border-cyan-200/80 bg-white/78 px-3.5 py-1.5 text-xs font-semibold uppercase text-cyan-800 shadow-sm shadow-cyan-100/60 backdrop-blur [animation-delay:80ms]">
            CareGrid public access
          </p>
          <h1 className="animate-landing-fade-in-up mt-5 max-w-3xl text-4xl font-bold leading-[1.05] tracking-normal text-slate-950 sm:text-5xl lg:text-[3.55rem]">
            Hospital operations, centered on patient care.
          </h1>
          <p className="animate-landing-fade-in-up mt-5 max-w-xl text-base leading-8 text-slate-600 [animation-delay:160ms] sm:text-lg">
            A calm entry point for hospital teams, patients, and family
            attendants to access the right CareGrid workspace without clutter.
          </p>

          <div className="animate-landing-fade-in-up mt-6 flex max-w-xl flex-wrap gap-2.5 [animation-delay:210ms]">
            {trustSignals.map(({ label, Icon }) => (
              <div
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-white/82 px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm shadow-cyan-100/50 backdrop-blur"
              >
                <Icon aria-hidden="true" className="h-4 w-4 text-cyan-700" />
                <span>{label}</span>
              </div>
            ))}
          </div>

          <div className="animate-landing-fade-in-up mt-7 flex flex-col gap-3 [animation-delay:240ms] sm:flex-row">
            <Button
              size="lg"
              asChild
              className="group h-12 bg-cyan-800 px-7 text-base font-semibold shadow-lg shadow-cyan-800/18 transition hover:-translate-y-0.5 hover:bg-cyan-900 hover:shadow-xl hover:shadow-cyan-800/20 active:translate-y-0"
            >
              <Link href="/login">
                <span>Sign In to CareGrid</span>
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="h-12 border-cyan-200 bg-white/82 px-7 text-base font-semibold text-cyan-900 shadow-sm transition hover:-translate-y-0.5 hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-800 active:translate-y-0"
            >
              <Link href="/register">Create Account</Link>
            </Button>
          </div>
        </div>

        <p className="sr-only">
          CareGrid connects patient care, organ, blood bank, pharmacy, and billing
          workflows around one patient context.
        </p>
        <div
          aria-hidden="true"
          className="animate-landing-fade-in-up relative mx-auto hidden w-full max-w-[480px] [animation-delay:320ms] lg:block"
        >
          <CareGridPreview />
        </div>
      </div>
    </section>
  );
}
