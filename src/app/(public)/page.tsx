import { LandingHeader } from "@/components/marketing/landing/landing-header";
import { LandingHero } from "@/components/marketing/landing/landing-hero";
import styles from "@/components/marketing/landing/landing-shell.module.css";

export default function PublicHomePage() {
  return (
    <div className="relative min-h-[100dvh] overflow-x-hidden bg-slate-50 md:overflow-hidden">
      <div
        aria-hidden="true"
        className={`absolute inset-0 -z-10 ${styles.ambientLayer}`}
      />
      <div
        aria-hidden="true"
        className={`absolute inset-0 -z-10 ${styles.ambientShadow}`}
      />
      <div
        aria-hidden="true"
        className={`absolute inset-0 -z-10 ${styles.medicalGrid}`}
      />

      <LandingHeader />
      <main className="pt-16">
        <LandingHero />
      </main>
    </div>
  );
}
