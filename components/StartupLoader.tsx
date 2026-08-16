"use client";

import { motion, useAnimate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE, usePrefersReducedMotion } from "@/lib/motion";

interface StartupLoaderProps {
  onComplete?: () => void;
}

/*
  The logo draws itself, settles, then flies to its post as the header mark.

    0.00 → 0.90s : four strokes draw on, staggered — bars wipe down, the D
                   bowl sweeps, the amber C sweeps, the crossbar shoots right
    0.90 → 1.25s : one confident overshoot (1 → 1.04 → 1)
    1.25 → 1.75s : mark scales+travels to the HUD logo slot while the black
                   ground wipes away and the page fades up beneath

  The travel is the point: the intro logo and the header logo are the same
  object, so the loader resolves into the hero instead of disappearing in
  front of it. The target is measured from the real header <img> (tagged
  data-header-logo) at the moment we need it, with a fallback for the case
  where that node has not mounted yet.

  Geometry note: the paths below are a measured reconstruction of
  /DexDev-Logo-144.png — bars 8w at x=5/x=21 spanning y6..138, bowl arc
  r=62.34 about (22.76,71.24) from -83° to +83°, amber C r=59.2 about
  (115.4,71.47) from 60° to 300° (118° gap on the right), crossbar y=71.5
  from x=56..142. Centerline strokes, not an outline trace, so
  stroke-dashoffset draws them the way a pen would.
*/

const DRAW_MS = 900;
const SETTLE_MS = 350;
const TRAVEL_MS = 500;
const TOTAL_MS = DRAW_MS + SETTLE_MS + TRAVEL_MS;

const REDUCED_MS = 400;
const SESSION_KEY = "portfolio_visited";

/** Where the mark sits if the header logo cannot be measured. Mirrors the
 *  HUD's own padding: px-5 py-4 on mobile, md:px-12 md:pt-12. */
const FALLBACK_TARGET = { x: 20, y: 16, size: 28 };
const FALLBACK_TARGET_MD = { x: 48, y: 48, size: 48 };

const AMBER = "#FFB800";
/* The logo's own ink. On the white ground it needs no inversion, and it is
   already the colour the header mark lands in — so the hand-off is a true
   continuation rather than a colour swap. */
const INK = "#111111";

/** Each stroke: path, colour, width, and when it starts drawing (ms). */
const STROKES = [
  { d: "M5 6 V138", stroke: INK, width: 8, at: 0 },
  { d: "M21 6 V138", stroke: INK, width: 8, at: 90 },
  { d: "M30.36 9.36 A62.34 62.34 0 0 1 30.36 133.12", stroke: INK, width: 11.5, at: 180 },
  { d: "M145 122.74 A59.2 59.2 0 1 1 145 20.2", stroke: AMBER, width: 12, at: 330 },
  { d: "M56 71.5 H142", stroke: AMBER, width: 8, at: 560 },
] as const;

/** Longest single stroke draw, so the last one still finishes by DRAW_MS. */
const STROKE_DRAW_MS = 520;

export default function StartupLoader({ onComplete }: StartupLoaderProps) {
  /*
   * Decide during the first render, not in an effect. The page underneath is
   * gated on this loader, so a one-frame flash of the overlay on an already-
   * visited page would be a visible blink. useState's initializer runs once
   * per mount, before paint.
   *
   * Reading sessionStorage has to be deferred to the client — it does not
   * exist during SSR — so the initial value is `true` on the server and the
   * real answer is resolved on mount below.
   */
  const [visible, setVisible] = useState(true);
  const [scope, animate] = useAnimate();
  const markRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  // onComplete is called from inside an async sequence — keep the latest
  // reference without making the effect depend on it.
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  /*
   * Completion must happen exactly once per page load. React StrictMode
   * mounts effects twice in development, and the guard timeout can fire
   * after the sequence already resolved — without this latch the second
   * pass re-runs the intro and resets the overlay to full opacity.
   */
  const doneRef = useRef(false);

  useEffect(() => {
    if (doneRef.current) return;

    let cancelled = false;
    const finish = () => {
      if (cancelled || doneRef.current) return;
      doneRef.current = true;
      setVisible(false);
      onCompleteRef.current?.();
    };

    // Already seen this session — skip straight through, no animation.
    if (sessionStorage.getItem(SESSION_KEY) === "1") {
      finish();
      return;
    }
    sessionStorage.setItem(SESSION_KEY, "1");

    if (reducedMotion) {
      const t = setTimeout(finish, REDUCED_MS);
      return () => {
        cancelled = true;
        clearTimeout(t);
      };
    }

    const run = async () => {
      // Hold the drawn mark, then overshoot once.
      await animate(
        markRef.current!,
        { scale: [1, 1.04, 1] },
        { duration: SETTLE_MS / 1000, delay: DRAW_MS / 1000, ease: EASE },
      );
      if (cancelled) return;

      // Measure the header logo now — by this point the page beneath has
      // mounted, so the real slot is available.
      const header = document.querySelector<HTMLElement>("[data-header-logo]");
      const isMd = window.matchMedia("(min-width: 768px)").matches;
      const fallback = isMd ? FALLBACK_TARGET_MD : FALLBACK_TARGET;

      let targetX = fallback.x;
      let targetY = fallback.y;
      let targetSize = fallback.size;

      const rect = header?.getBoundingClientRect();
      // A hidden or not-yet-laid-out node measures 0 — treat that as absent.
      if (rect && rect.width > 0) {
        targetX = rect.left;
        targetY = rect.top;
        targetSize = rect.width;
      }

      const mark = markRef.current;
      if (!mark || cancelled) return finish();

      /*
       * offsetWidth is the untransformed layout width. getBoundingClientRect
       * would report the post-settle scale baked in, and dividing by that
       * would compound with the scale we are about to animate to.
       */
      const from = mark.getBoundingClientRect();
      const baseWidth = mark.offsetWidth || from.width;
      const scale = targetSize / baseWidth;
      // Translate centre-to-centre, then scale about that centre.
      const dx = targetX + targetSize / 2 - (from.left + from.width / 2);
      const dy = targetY + targetSize / 2 - (from.top + from.height / 2);

      await Promise.all([
        animate(
          mark,
          { x: dx, y: dy, scale },
          { duration: TRAVEL_MS / 1000, ease: EASE },
        ),
        // Ground wipes out slightly ahead of the mark's arrival so the hero
        // is already visible when the logo lands.
        animate(
          scope.current,
          { opacity: 0 },
          { duration: (TRAVEL_MS - 80) / 1000, delay: 0.08, ease: "easeInOut" },
        ),
      ]);

      finish();
    };

    // Safety net: if an animation never settles, do not strand the page
    // behind an invisible overlay.
    const guard = setTimeout(finish, TOTAL_MS + 1200);
    run();

    return () => {
      cancelled = true;
      clearTimeout(guard);
    };
    // Runs once per mount. `visible` is deliberately not a dependency: it is
    // this effect's own output, and re-running on it would restart the intro.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  if (!visible) return null;

  /*
   * Plain div, not motion.div: the overlay's opacity is driven imperatively
   * by animate(), and a declarative `initial` on the same element competes
   * with it and wins on re-render.
   */
  return (
    <div
      ref={scope}
      className="fixed inset-0 z-[1000] pointer-events-none flex items-center justify-center bg-white"
    >
      <motion.div
        ref={markRef}
        className="w-24 h-24 md:w-36 md:h-36"
        style={{ willChange: "transform" }}
      >
        <svg
          viewBox="0 0 144 144"
          className="w-full h-full overflow-visible"
          fill="none"
          aria-label="Dexter Jethro Enriquez"
          role="img"
        >
          {STROKES.map(({ d, stroke, width, at }, i) => (
            <motion.path
              key={i}
              d={d}
              stroke={stroke}
              strokeWidth={width}
              strokeLinecap="butt"
              /* Tighter, denser glow than a dark ground would need — a soft
                 wide halo washes out against white. */
              style={
                stroke === AMBER
                  ? { filter: `drop-shadow(0 0 4px ${AMBER}99)` }
                  : undefined
              }
              initial={{ pathLength: reducedMotion ? 1 : 0 }}
              animate={{ pathLength: 1 }}
              transition={
                reducedMotion
                  ? { duration: 0 }
                  : {
                      duration: STROKE_DRAW_MS / 1000,
                      delay: at / 1000,
                      ease: EASE,
                    }
              }
            />
          ))}
        </svg>
      </motion.div>
    </div>
  );
}
