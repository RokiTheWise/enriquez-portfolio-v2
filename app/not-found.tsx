"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { EASE, DUR } from "@/lib/motion";
import ViewportBrackets from "@/components/archive/ViewportBrackets";
import DecryptedText from "@/components/hero/DecryptedText";

/*
 * 404 — styled as a failed lookup in the same "system readout" language the
 * rest of the site uses: mono type, amber accent, viewfinder brackets and a
 * status block. Deliberately static (no WebGL, no Lenis, no scroll narrative)
 * so an error page never costs more than the content it is apologising for.
 */

const ACCENT = "#FFB800";

/** Rows of the diagnostic block. Values that need the client are filled in below. */
const STATUS_ROWS = [
  { label: "Status", value: "404 — NOT FOUND" },
  { label: "Cause", value: "No route matches this path" },
] as const;

/*
 * The requested path and the render time only exist on the client. Reading
 * them via useSyncExternalStore (rather than setState in an effect) gives the
 * server a stable placeholder and the browser the real value, with no
 * hydration mismatch and no extra render pass.
 *
 * Neither value ever changes after mount, so subscribe is a no-op.
 */
const noopSubscribe = () => () => {};

/* getSnapshot must return a referentially stable value or React re-renders
   forever, so the timestamp is captured once at module scope rather than
   recomputed per call. */
const RENDER_STAMP =
  typeof window === "undefined"
    ? "—"
    : new Date().toISOString().slice(0, 19).replace("T", " ") + " UTC";

const getPath = () => window.location.pathname;
const getStamp = () => RENDER_STAMP;
const getFallback = () => "—";

export default function NotFound() {
  const path = useSyncExternalStore(noopSubscribe, getPath, getFallback);
  const stamp = useSyncExternalStore(noopSubscribe, getStamp, getFallback);

  return (
    <main className="relative min-h-[100dvh] bg-white overflow-hidden flex items-center justify-center px-6 py-20">
      {/* Viewfinder frame, inset from the page edges */}
      <div className="pointer-events-none absolute inset-4 md:inset-8">
        <ViewportBrackets color={ACCENT} arm={28} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: DUR.base, ease: EASE }}
        className="relative w-full max-w-lg"
      >
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-2 h-[1px]" style={{ background: ACCENT }} />
          <span
            className="font-mono text-[9px] tracking-[0.3em] uppercase"
            style={{ color: `${ACCENT}99` }}
          >
            System Response
          </span>
        </div>

        {/* Headline — scrambles in, matching the hero's nav treatment */}
        <h1 className="font-mono text-5xl md:text-7xl font-bold tracking-display-md md:tracking-display-lg text-black uppercase leading-[0.95]">
          <DecryptedText
            text="404"
            animateOn="view"
            revealDirection="center"
            speed={45}
            maxIterations={14}
            encryptedClassName="text-[#FFB800]/50"
          />
          <span className="block mt-1" style={{ color: ACCENT }}>
            <DecryptedText
              text="Signal Lost"
              animateOn="view"
              revealDirection="start"
              speed={30}
              maxIterations={12}
              encryptedClassName="text-black/30"
            />
          </span>
        </h1>

        <p className="mt-5 font-mono text-[11px] md:text-xs leading-[1.9] text-black/55 max-w-md">
          The page you requested is not in the deployment. It may have been
          moved, renamed, or never existed at this address.
        </p>

        {/* Diagnostic block */}
        <div className="mt-8 border-t border-black/[0.08]">
          {STATUS_ROWS.map((row) => (
            <Row key={row.label} label={row.label} value={row.value} />
          ))}
          <Row label="Path" value={path} mono />
          <Row label="Timestamp" value={stamp} />
        </div>

        {/* Actions */}
        <div className="mt-9 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Link
            href="/"
            className="group inline-flex items-center justify-center gap-3 font-mono text-[11px] md:text-xs tracking-[0.2em] uppercase font-semibold border border-black bg-black text-white px-7 py-3.5 no-underline transition-[background-color,color,transform] duration-200 hover:bg-transparent hover:text-black active:scale-[0.97] active:duration-[120ms]"
          >
            <span>Return Home</span>
            <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">
              &larr;
            </span>
          </Link>

          <Link
            href="/archive"
            className="group inline-flex items-center justify-center gap-3 font-mono text-[11px] md:text-xs tracking-[0.2em] uppercase font-semibold border border-black/20 text-black px-7 py-3.5 no-underline transition-[border-color,background-color,transform] duration-200 hover:border-black hover:bg-black/[0.03] active:scale-[0.97] active:duration-[120ms]"
          >
            <span>Browse Archive</span>
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        </div>
      </motion.div>
    </main>
  );
}

/** One label/value line in the diagnostic block. */
function Row({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-baseline gap-4 py-2.5 border-b border-black/[0.08]">
      <span className="font-mono text-[9px] tracking-[0.25em] text-black/45 uppercase w-24 flex-shrink-0">
        {label}
      </span>
      <span
        className={`font-mono text-[11px] text-black/70 ${mono ? "break-all" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
