import { Building2, CircleDot, UsersRound } from "lucide-react";

import styles from "./caregrid-preview.module.css";

const contextPoints = [
  { label: "Patient context", Icon: CircleDot },
  { label: "Care teams", Icon: UsersRound },
  { label: "Hospital workflows", Icon: Building2 },
];

export function CareGridPreview() {
  return (
    <div className={`relative mx-auto w-full max-w-[480px] ${styles.previewShell}`}>
      <div className={`relative aspect-[1.05] overflow-hidden rounded-lg border border-cyan-100 bg-white/72 shadow-2xl shadow-cyan-900/10 backdrop-blur ${styles.visualPanel}`}>
        <div className={`absolute inset-x-10 top-8 h-28 rounded-full ${styles.softShadow}`} />
        <div className={`absolute -right-10 top-12 h-40 w-40 rounded-full ${styles.careGlow}`} />
        <div className={`absolute -left-8 bottom-8 h-32 w-32 rounded-full ${styles.careGlowMuted}`} />

        <svg
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 480 456"
        >
          <defs>
            <linearGradient id="caregrid-flow" x1="76" x2="396" y1="284" y2="160">
              <stop stopColor="#0e7490" stopOpacity="0.12" />
              <stop offset="0.48" stopColor="#0f766e" stopOpacity="0.68" />
              <stop offset="1" stopColor="#2563eb" stopOpacity="0.22" />
            </linearGradient>
          </defs>
          <path
            d="M82 300 C132 258 164 286 207 236 C247 190 295 214 338 170 C363 144 391 144 420 160"
            fill="none"
            stroke="url(#caregrid-flow)"
            strokeLinecap="round"
            strokeWidth="4"
            className={styles.pulseLine}
          />
          <path
            d="M92 326 C152 292 180 326 232 278 C272 242 310 252 374 218"
            fill="none"
            stroke="#0e7490"
            strokeLinecap="round"
            strokeOpacity="0.14"
            strokeWidth="2"
          />
        </svg>

        <div className="absolute left-1/2 top-[42%] w-[72%] -translate-x-1/2 -translate-y-1/2 rounded-lg border border-cyan-100 bg-white/88 p-5 shadow-xl shadow-cyan-900/10 backdrop-blur">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-cyan-800 text-xl font-bold text-white shadow-lg shadow-cyan-800/20">
              C
            </div>
            <div>
              <p className="text-sm font-semibold uppercase text-cyan-800">
                CAREGRID.IO
              </p>
              <p className="mt-1 text-lg font-bold text-slate-950">
                Connected hospital care
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-2">
            {contextPoints.map(({ label, Icon }) => (
              <div
                key={label}
                className="flex items-center justify-between rounded-md border border-slate-100 bg-slate-50/72 px-3 py-2"
              >
                <span className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Icon aria-hidden="true" className="h-4 w-4 text-cyan-700" />
                  {label}
                </span>
                <span className="h-2 w-2 rounded-full bg-teal-400 shadow-sm shadow-teal-300" />
              </div>
            ))}
          </div>
        </div>

        <div className="absolute inset-x-8 bottom-8 rounded-lg border border-cyan-100 bg-white/70 px-4 py-3 shadow-lg shadow-cyan-900/5 backdrop-blur">
          <p className="text-center text-xs font-semibold uppercase text-cyan-800">
            One access layer for connected care
          </p>
        </div>
      </div>
    </div>
  );
}
