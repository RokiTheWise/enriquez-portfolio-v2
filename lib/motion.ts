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
