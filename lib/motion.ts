"use client";

import { useEffect, useState } from "react";

/*
 * Shared motion tokens — single source of truth for scroll/animation feel.
 *
 * Principle: Lenis is the ONLY smoothing layer. Scroll-linked animation
 * (sticky pins, scrubbed timelines, progress bars) maps 1:1 from the
 * Lenis-smoothed scroll position — no extra springs or scrub lag on top.
 * Time-based (one-shot) animations share one ease family and the DUR scale.
 */

/** Expo-out cubic bezier — all Framer Motion entrances and crossfades. */
export const EASE = [0.16, 1, 0.3, 1] as const;

/** Same curve for GSAP tweens. */
export const EASE_GSAP = "expo.out";

/** Function form of expo-out, for Lenis scrollTo easing. */
export const easeOutExpo = (t: number) =>
  t === 1 ? 1 : 1 - Math.pow(2, -10 * t);

/** Duration scale (seconds): swap/crossfade, section entrance, hero-scale. */
export const DUR = {
  fast: 0.35,
  base: 0.6,
  slow: 1.2,
} as const;

/**
 * Explicit Lenis config — slightly crisper than the 0.1 default lerp.
 * Tune feel here, not per-section.
 */
export const LENIS_OPTIONS = {
  lerp: 0.12,
} as const;

/** Anchor (in-page #hash) scrolls. */
export const ANCHOR_SCROLL = {
  duration: 1.4,
  easing: easeOutExpo,
} as const;

/*
 * Named curves for the one-shot transitions that previously hand-typed their
 * own beziers. Kept as tokens so the page transition and the loader read from
 * the same source as everything else.
 */

/** Symmetric in-out curve — page-transition curtain sweep. */
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;

/** GSAP string form of the expo-out exit, for reversible drawer motion. */
export const EASE_GSAP_IN = "expo.in";

/**
 * Apple-style drawer spring: critically-damped-ish with a touch of weight.
 * Used for the menu panel, which is the one surface a user grabs directly.
 */
export const SPRING_DRAWER = {
  type: "spring",
  bounce: 0.2,
  duration: 0.45,
} as const;

/** Press feedback — scale + duration for pointer-down affordances. */
export const PRESS = {
  scale: 0.97,
  transition: { duration: 0.12, ease: EASE },
} as const;

/**
 * Reduced-motion flag that is safe to branch *layout* on.
 *
 * Framer Motion's own useReducedMotion() reports false on the server and for
 * the first client render, then flips after mount. That is fine for animation
 * values (they simply animate once) but wrong for structural decisions like
 * "is this section a sticky horizontal track or a plain vertical stack" —
 * those are read during render and keep the initial value, so the reduced
 * layout never appears.
 *
 * This subscribes to the media query directly and re-renders on change.
 */
export function usePrefersReducedMotion(): boolean {
  const [prefers, setPrefers] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefers(mq.matches);

    update();
    mq.addEventListener("change", update);

    return () => mq.removeEventListener("change", update);
  }, []);

  return prefers;
}
