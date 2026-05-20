"use client";

import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";

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

// Three yellow shades — lightest leads, darkest is the main panel
const LAYER_COLORS = ["#FFF3D6", "#FFD166", "#FFB800"];
const STAGGER     = 0.07;  // seconds between each layer
const SWEEP_IN    = 0.45;  // each layer slide-in duration
const HOLD        = 80;    // ms pause at full cover before route push
const SWEEP_OUT   = 0.32;  // all layers exit together

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const router      = useRouter();
  const layerRefs   = useRef<(HTMLDivElement | null)[]>([]);
  const isAnimating = useRef(false);
  const mounted     = useRef(true);

  useEffect(() => {
    mounted.current = true;
    // Park all layers off-screen to the right
    layerRefs.current.forEach((el) => {
      if (el) gsap.set(el, { xPercent: 100 });
    });
    return () => { mounted.current = false; };
  }, []);

  const navigate = useCallback(
    (href: string) => {
      if (isAnimating.current) return;
      const layers = layerRefs.current.filter(Boolean) as HTMLDivElement[];
      if (!layers.length) { router.push(href); return; }

      isAnimating.current = true;

      // 1. Stagger layers in from the right
      const tl = gsap.timeline({
        onComplete: () => {
          // 2. Hold briefly, push route, then sweep all out to the left
          setTimeout(() => {
            router.push(href);

            setTimeout(() => {
              if (!mounted.current) return;
              gsap.to(layers, {
                xPercent: -100,
                duration: SWEEP_OUT,
                ease: "power3.in",
                stagger: 0,
                onComplete: () => {
                  if (!mounted.current) return;
                  // Reset off-screen right for next use
                  gsap.set(layers, { xPercent: 100 });
                  isAnimating.current = false;
                },
              });
            }, 80);
          }, HOLD);
        },
      });

      layers.forEach((el, i) => {
        tl.to(
          el,
          { xPercent: 0, duration: SWEEP_IN, ease: "power4.out" },
          i * STAGGER
        );
      });
    },
    [router]
  );

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {children}

      {/* Layered curtain — fixed, off-screen right, above everything */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99999,
          pointerEvents: "none",
        }}
      >
        {LAYER_COLORS.map((color, i) => (
          <div
            key={i}
            ref={(el) => { layerRefs.current[i] = el; }}
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: color,
              transform: "translateX(100%)",
            }}
          />
        ))}
      </div>
    </TransitionContext.Provider>
  );
}
