"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { animate } from "framer-motion";

/* ── Types ── */
interface TransitionContextValue {
  navigate: (href: string) => void;
}

/* ── Context ── */
const TransitionContext = createContext<TransitionContextValue>({
  navigate: (href) => { window.location.href = href; },
});

/* ── Hook ── */
export function usePageTransition() {
  return useContext(TransitionContext);
}

/* ── Curtain timings (ms) ── */
const SWEEP_IN  = 0.32;  // curtain covers screen
const HOLD      = 0.08;  // brief pause at full cover
const SWEEP_OUT = 0.38;  // curtain exits after new page mounts

/* ── Provider + Curtain ── */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const curtainRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const isAnimatingRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const navigate = useCallback(
    (href: string) => {
      if (isAnimatingRef.current) return;
      const el = curtainRef.current;
      if (!el) { router.push(href); return; }

      isAnimatingRef.current = true;

      // Derive a short label for the destination
      const segment = href === "/" || href.startsWith("/?") ? "Home" : href.replace(/^\//, "").split("/")[0];
      setLabel(segment.charAt(0).toUpperCase() + segment.slice(1));

      // 1. Sweep curtain IN (up from bottom)
      animate(el, { y: "0%" }, { duration: SWEEP_IN, ease: [0.76, 0, 0.24, 1] })
        .then(() =>
          // 2. Hold briefly, then push route
          new Promise<void>((res) => setTimeout(() => { router.push(href); res(); }, HOLD * 1000))
        )
        .then(() =>
          // 3. Sweep curtain OUT (up off screen)
          animate(el, { y: "-100%" }, { duration: SWEEP_OUT, ease: [0.76, 0, 0.24, 1] })
        )
        .then(() => {
          if (!mountedRef.current) return;
          // Reset off-screen below so it's ready for next use
          animate(el, { y: "100%" }, { duration: 0 });
          setLabel("");
          isAnimatingRef.current = false;
        });
    },
    [router]
  );

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}

      {/* Curtain overlay — starts below viewport, z above everything */}
      <div
        ref={curtainRef}
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          transform: "translateY(100%)",
          zIndex: 99999,
          backgroundColor: "#0a0a0a",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pointerEvents: "none",
        }}
      >
        {label && (
          <span
            style={{
              fontFamily: "var(--font-geist-mono), monospace",
              fontSize: "clamp(11px, 1vw, 13px)",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.25)",
            }}
          >
            {label}
          </span>
        )}
      </div>
    </TransitionContext.Provider>
  );
}
