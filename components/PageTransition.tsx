"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { animate } from "framer-motion";
import { EASE_IN_OUT } from "@/lib/motion";

interface TransitionContextValue {
  navigate: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextValue>({
  navigate: (href) => { window.location.href = href; },
});

export function usePageTransition() {
  return useContext(TransitionContext);
}

const SWEEP_IN  = 0.32;
const HOLD      = 0.08;
const SWEEP_OUT = 0.38;

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const curtainRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);
  const mountedRef = useRef(true);
  const [label, setLabel] = useState("");

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

      const segment = href === "/" || href.startsWith("/?") ? "Home" : href.replace(/^\//, "").split("/")[0];
      setLabel(segment.charAt(0).toUpperCase() + segment.slice(1));

      /*
       * A full-viewport surface travelling across the screen is the exact kind
       * of motion §14 asks us to drop. Reduced motion gets the same curtain as
       * a stationary cross-fade, so the navigation is still covered.
       */
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (reduced) {
        animate(el, { x: "0%", opacity: [0, 1] }, { duration: 0.2, ease: "easeOut" })
          .then(() =>
            new Promise<void>((res) => setTimeout(() => { router.push(href); res(); }, HOLD * 1000))
          )
          .then(() => animate(el, { opacity: 0 }, { duration: 0.2, ease: "easeOut" }))
          .then(() => {
            if (!mountedRef.current) return;
            animate(el, { x: "100%", opacity: 1 }, { duration: 0 });
            setLabel("");
            isAnimatingRef.current = false;
          });
        return;
      }

      // Sweep in from right
      animate(el, { x: "0%" }, { duration: SWEEP_IN, ease: EASE_IN_OUT })
        .then(() =>
          new Promise<void>((res) => setTimeout(() => { router.push(href); res(); }, HOLD * 1000))
        )
        .then(() =>
          // Exit to the left
          animate(el, { x: "-100%" }, { duration: SWEEP_OUT, ease: EASE_IN_OUT })
        )
        .then(() => {
          if (!mountedRef.current) return;
          animate(el, { x: "100%" }, { duration: 0 });
          setLabel("");
          isAnimatingRef.current = false;
        });
    },
    [router]
  );

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}

      {/* Starts off-screen right, sweeps left across, exits left */}
      <div
        ref={curtainRef}
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          transform: "translateX(100%)",
          zIndex: 99999,
          backgroundColor: "#FFB800",
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
              fontSize: "clamp(13px, 1.5vw, 16px)",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              fontWeight: 700,
              color: "rgba(0,0,0,0.55)",
            }}
          >
            {label}
          </span>
        )}
      </div>
    </TransitionContext.Provider>
  );
}
