"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ParticleCard,
  GlobalSpotlight,
  useCardEffectsDisabled,
} from "./MagicBento";
import { DUR, EASE_GSAP } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════
   QPI Performance Ring — SVG circle that animates 0→93%
   when the card scrolls into view.
   ═══════════════════════════════════════════════════════════ */
function QPIRing() {
  const ringRef = useRef<SVGCircleElement>(null);
  const R = 52;
  const C = 2 * Math.PI * R; // ≈ 326.7
  const pct = 0.93;

  useEffect(() => {
    const el = ringRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { strokeDashoffset: C },
        {
          strokeDashoffset: C * (1 - pct),
          duration: DUR.slow,
          ease: EASE_GSAP,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    });

    return () => ctx.revert();
  }, [C, pct]);

  return (
    <svg
      className="absolute inset-0 w-full h-full"
      viewBox="0 0 120 120"
      fill="none"
    >
      {/* Track ring */}
      <circle
        cx="60"
        cy="60"
        r={R}
        stroke="rgba(0,0,0,0.05)"
        strokeWidth="3"
        fill="none"
      />
      {/* Animated progress ring */}
      <circle
        ref={ringRef}
        cx="60"
        cy="60"
        r={R}
        stroke="#FFB800"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        strokeDasharray={C}
        strokeDashoffset={C}
        transform="rotate(-90 60 60)"
      />
      {/* Centered number */}
      <text
        x="60"
        y="60"
        textAnchor="middle"
        dominantBaseline="central"
        className="font-mono text-[34px] font-bold tracking-tighter"
        fill="black"
      >
        3.76
      </text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════ */

const GLOW_COLOR = "255, 184, 0"; // #FFB800 in RGB

export default function About() {
  // ParticleCard/GlobalSpotlight are imported directly here, which bypasses the
  // mobile gate MagicBento's own export applies — so apply it explicitly.
  const effectsDisabled = useCardEffectsDisabled();
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const academicRef = useRef<HTMLDivElement>(null);
  const achievementRef = useRef<HTMLDivElement>(null);
  const interestsRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Reduced motion: cards still resolve into place, but they fade rather
      // than fly in from off-screen. The pin/hold structure is preserved so the
      // scroll narrative still reads.
      const reduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const vw = reduced ? 0 : window.innerWidth;

      const allCards = [
        bioRef.current,
        metricsRef.current,
        interestsRef.current,
        academicRef.current,
        achievementRef.current,
      ].filter(Boolean);

      /* ═══════════════════════════════════════════════════════════
         Phase 1 — ENTRANCE  (no pin)
         Heading and bio arrive as the section scrolls up, so the
         section is already legible the moment it pins. The four
         surrounding cards deliberately do NOT arrive here — they are
         revealed during the pin (Phase 2) so that the pinned scroll
         maps to visible progress instead of a dead hold.
         scrub: true — Lenis is the only smoothing layer, so the
         timeline tracks scroll 1:1 (no extra catch-up lag).
         ═══════════════════════════════════════════════════════════ */
      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "top top",
          scrub: true,
        },
      });

      // Heading
      entranceTl.fromTo(
        headingRef.current,
        { opacity: 0, y: reduced ? 0 : 30 },
        { opacity: 1, y: 0, duration: 0.3 },
        0,
      );

      // Bio — center, scale up + fade with snap
      entranceTl.fromTo(
        bioRef.current,
        { opacity: 0, scale: reduced ? 1 : 0.88 },
        { opacity: 1, scale: 1, duration: 0.6, ease: EASE_GSAP },
        0.1,
      );

      /* ═══════════════════════════════════════════════════════════
         Phase 2 — PIN + REVEAL + EXIT
         The pin previously spent ~70 % of its budget on a hold with
         no tweens, so roughly a viewport and a half of scrolling
         produced no visual change and read as a frozen page.

         That budget now carries the four surrounding cards in, one
         pair at a time, so every scroll increment maps to something
         moving. Budget trimmed 150% → 120% to match the real content.

           0.00 → 0.20   metrics  (top-left)
           0.18 → 0.40   academic (top-right)
           0.38 → 0.60   interests(bottom-left)
           0.58 → 0.80   achievement (bottom-right)
           0.80 → 0.88   read beat (assembled grid)
           0.88 → 1.00   exit

         Budget is 100vh of pinned scroll (was 150%). The reveal now fills
         the scroll that used to be a dead hold, so a longer runway would
         just re-introduce empty scrolling after the exit completes.
         ═══════════════════════════════════════════════════════════ */
      const pinTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${window.innerHeight}`,
          pin: true,
          scrub: true,
          anticipatePin: 1,
        },
      });

      /* Cards arrive from their own side of the grid, so the motion
         explains where each one belongs. Reduced motion keeps the
         same sequence but fades in place. */
      const reveal = (
        el: HTMLDivElement | null,
        fromX: number,
        at: number,
      ) => {
        if (!el) return;
        pinTl.fromTo(
          el,
          { x: reduced ? 0 : fromX, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.22,
            ease: EASE_GSAP,
          },
          at,
        );
      };

      reveal(metricsRef.current, -vw * 0.35, 0.0);
      reveal(academicRef.current, vw * 0.35, 0.18);
      reveal(interestsRef.current, -vw * 0.35, 0.38);
      reveal(achievementRef.current, vw * 0.35, 0.58);

      // 0.88 → 1.0 — exit (short beat at 0.80–0.88 to read the full grid)
      pinTl.to(
        headingRef.current,
        { opacity: 0, y: reduced ? 0 : -20, duration: 0.08 },
        0.88,
      );
      pinTl.to(
        allCards,
        { opacity: 0, y: reduced ? 0 : -30, duration: 0.1, stagger: 0.015 },
        0.9,
      );

      /* The label fixes the timeline's total length at 1.0 so the ratios above
         map onto the whole pinned runway. Without it GSAP ends the timeline at
         the last tween (~0.98) and the remaining scroll is dead. */
      pinTl.addLabel("end", 1.0);
    }, section);

    return () => ctx.revert();
  }, []);

  /* ── Shared card shell ──
     Hover treatment is opacity/colour only (border glow + spotlight). The
     inner `group-hover:-translate-y-1` lift is real CSS :hover, so unlike the
     old mousemove-driven tilt it cannot be triggered by scrolling past.

     No backdrop-blur here: the card background is opaque, so the filter was
     computed and discarded on every one of these. */
  const card =
    "card card--border-glow border border-black/[0.04] bg-white " +
    "shadow-[0_2px_5px_rgba(0,0,0,0.05),0_10px_20px_rgba(0,0,0,0.04),0_20px_40px_rgba(0,0,0,0.04)] " +
    "transition-[box-shadow,border-color,background-color,opacity] duration-300 group h-full rounded-2xl";

  /*
   * Tilt and magnetism are off by design.
   *
   * Both are driven by mousemove, but scrolling moves the card under a
   * stationary cursor — which fires mousemove with no hovering intent. Cards
   * would tilt and drift purely from scrolling past them, and because the
   * cursor is rarely near a card's centre at that moment, the rotation lands
   * at an off-axis angle that reads as a skew against the neighbouring cards.
   *
   * The border glow and spotlight stay: they are opacity/colour only, so they
   * degrade gracefully under the same stray mousemove events.
   */
  const particleProps = {
    glowColor: GLOW_COLOR,
    enableTilt: false,
    enableMagnetism: false,
    clickEffect: !effectsDisabled,
    particleCount: 8,
    disableAnimations: effectsDisabled,
  } as const;

  return (
    <section
      ref={sectionRef}
      id="about"
      className="bento-section relative h-screen bg-white overflow-hidden"
    >
      <style>{`
        .bento-section {
          --glow-x: 50%;
          --glow-y: 50%;
          --glow-intensity: 0;
          --glow-radius: 200px;
          --glow-color: ${GLOW_COLOR};
        }
        .card--border-glow::after {
          content: '';
          position: absolute;
          inset: 0;
          padding: 4px;
          background: radial-gradient(
            var(--glow-radius) circle at var(--glow-x) var(--glow-y),
            rgba(${GLOW_COLOR}, calc(var(--glow-intensity) * 0.6)) 0%,
            rgba(${GLOW_COLOR}, calc(var(--glow-intensity) * 0.3)) 30%,
            transparent 60%
          );
          border-radius: inherit;
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude;
          pointer-events: none;
          z-index: 1;
        }
        .card--border-glow:hover {
          box-shadow:
            0 2px 5px rgba(0, 0, 0, 0.05),
            0 10px 20px rgba(0, 0, 0, 0.04),
            0 20px 40px rgba(0, 0, 0, 0.04),
            0 0 30px rgba(${GLOW_COLOR}, 0.1);
        }
        .particle::before {
          content: '';
          position: absolute;
          top: -2px; left: -2px; right: -2px; bottom: -2px;
          background: rgba(${GLOW_COLOR}, 0.2);
          border-radius: 50%;
          z-index: -1;
        }
      `}</style>

      <GlobalSpotlight
        gridRef={gridRef}
        enabled={!effectsDisabled}
        disableAnimations={effectsDisabled}
        spotlightRadius={350}
        glowColor={GLOW_COLOR}
      />

      <div className="h-full flex flex-col pt-24 md:pt-0 md:justify-center px-4 md:px-12 max-w-6xl mx-auto">
        {/* ── Heading ── */}
        <div ref={headingRef} className="mb-3 md:mb-10 opacity-0">
          <h2 className="font-mono text-3xl md:text-6xl font-bold tracking-display-md md:tracking-display-lg text-black uppercase">
            About
          </h2>
          <div className="mt-1 md:mt-2 font-mono text-[9px] md:text-xs tracking-[0.3em] text-black/55 uppercase">
            Profile Overview
          </div>
        </div>

        {/* ── Bento Grid ── */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-6"
        >
          {/* ── Bio — center 2×2 ── */}
          <div
            ref={bioRef}
            className="col-span-2 md:col-start-2 md:col-end-4 md:row-span-2 opacity-0"
          >
            <ParticleCard
              className={`${card} p-4 md:p-12 flex flex-col justify-center`}
              {...particleProps}
            >
              <div className="group-hover:-translate-y-1 transition-transform duration-300">
                <p className="font-mono text-xs md:text-base leading-relaxed text-black/65">
                  I came to Computer Science because I wanted to build things
                  that matter. That became a consistent thread of building
                  software for communities, tools that reduce friction, products
                  that reach people rather than just users.
                </p>
                <p className="font-mono text-xs md:text-base leading-relaxed text-black/65 mt-2 md:mt-4">
                  Outside of building, I lead, organize, and keep learning.
                  Currently picking up machine learning. Always looking for the
                  next problem worth solving.
                </p>
              </div>
            </ParticleCard>
          </div>

          {/* ── QPI — top-left (with performance ring) ── */}
          <div
            ref={metricsRef}
            className="md:col-start-1 md:row-start-1 opacity-0"
          >
            <ParticleCard
              className={`${card} p-4 md:p-10 flex flex-col justify-center items-center`}
              {...particleProps}
            >
              <div className="group-hover:-translate-y-1 transition-transform duration-300 text-center">
                <div className="relative w-20 h-20 md:w-32 md:h-32 mx-auto">
                  <QPIRing />
                </div>
                <span className="block font-mono text-[8px] md:text-[10px] tracking-[0.25em] text-black/58 uppercase mt-2 md:mt-3">
                  Cumulative QPI
                </span>
              </div>
            </ParticleCard>
          </div>

          {/* ── Interests — bottom-left ── */}
          <div
            ref={interestsRef}
            className="md:col-start-1 md:row-start-2 opacity-0"
          >
            <ParticleCard
              className={`${card} p-4 md:p-10 flex flex-col justify-center`}
              {...particleProps}
            >
              <div className="group-hover:-translate-y-1 transition-transform duration-300">
                <span className="font-mono text-[8px] md:text-[10px] tracking-[0.25em] text-[#FFB800] uppercase font-semibold">
                  Interests
                </span>
                <p className="font-mono text-[10px] md:text-sm text-black/60 mt-1.5 md:mt-2 leading-relaxed">
                  Civic Tech, Basketball, Formula One, and the Oxford comma.
                </p>
              </div>
            </ParticleCard>
          </div>

          {/* ── Education — top-right ── */}
          <div
            ref={academicRef}
            className="md:col-start-4 md:row-start-1 opacity-0"
          >
            <ParticleCard
              className={`${card} p-4 md:p-10 flex flex-col justify-center`}
              {...particleProps}
            >
              <div className="group-hover:-translate-y-1 transition-transform duration-300">
                <span className="font-mono text-[8px] md:text-[10px] tracking-[0.25em] text-[#FFB800] uppercase font-semibold">
                  Education
                </span>
                <p className="font-mono text-[10px] md:text-sm font-bold text-black/80 mt-1.5 md:mt-2">
                  BS Computer Science
                </p>
                <p className="font-mono text-[9px] md:text-xs text-black/55 mt-0.5">
                  Ateneo de Manila University
                </p>
                <div className="flex gap-3 md:gap-4 mt-2 md:mt-3">
                  <div>
                    <span className="font-mono text-[7px] md:text-[9px] tracking-[0.25em] text-[#FFB800] uppercase font-semibold">
                      Year Level
                    </span>
                    <p className="font-mono text-[9px] md:text-xs text-black/65 mt-0.5">
                      3rd Year
                    </p>
                  </div>
                  <div>
                    <span className="font-mono text-[7px] md:text-[9px] tracking-[0.25em] text-[#FFB800] uppercase font-semibold">
                      Status
                    </span>
                    <p className="font-mono text-[9px] md:text-xs text-black/65 mt-0.5">
                      Enrolled
                    </p>
                  </div>
                </div>
              </div>
            </ParticleCard>
          </div>

          {/* ── Scholarships — bottom-right ── */}
          <div
            ref={achievementRef}
            className="md:col-start-4 md:row-start-2 opacity-0"
          >
            <ParticleCard
              className={`${card} p-4 md:p-10 flex flex-col justify-center`}
              {...particleProps}
            >
              <div className="group-hover:-translate-y-1 transition-transform duration-300">
                <span className="font-mono text-[8px] md:text-[10px] tracking-[0.25em] text-[#FFB800] uppercase font-semibold">
                  Scholarships
                </span>
                <p className="font-mono text-[10px] md:text-sm font-bold text-black/80 mt-1.5 md:mt-2">
                  Jose P. Rizal & EO-Ayala Scholar
                </p>
                <p className="font-mono text-[9px] md:text-xs text-black/55 mt-0.5">
                  Full University & Corporate Merit
                </p>
              </div>
            </ParticleCard>
          </div>
        </div>
      </div>
    </section>
  );
}
