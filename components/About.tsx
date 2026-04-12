"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ParticleCard, GlobalSpotlight } from "./MagicBento";

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
          duration: 1.8,
          ease: "power3.out",
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
        3.72
      </text>
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════ */

const GLOW_COLOR = "255, 184, 0"; // #FFB800 in RGB

export default function About() {
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
      const vw = window.innerWidth;

      const allCards = [
        bioRef.current,
        metricsRef.current,
        interestsRef.current,
        academicRef.current,
        achievementRef.current,
      ].filter(Boolean);

      /* ═══════════════════════════════════════════════════════════
         Phase 1 — ENTRANCE  (no pin)
         Cards snap into grid positions from the sides with a
         spring-like back.out ease for a mechanical "snap" feel.
         ═══════════════════════════════════════════════════════════ */
      const entranceTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "top top",
          scrub: 0.5,
        },
      });

      // Heading
      entranceTl.fromTo(
        headingRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.3 },
        0,
      );

      // Bio — center, scale up + fade with snap
      entranceTl.fromTo(
        bioRef.current,
        { opacity: 0, scale: 0.88 },
        { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(2)" },
        0.1,
      );

      // Left cards — spring-snap from left
      entranceTl.fromTo(
        metricsRef.current,
        { x: -vw * 0.6, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.55, ease: "back.out(2.5)" },
        0.15,
      );
      entranceTl.fromTo(
        interestsRef.current,
        { x: -vw * 0.8, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "back.out(2.5)" },
        0.22,
      );

      // Right cards — spring-snap from right
      entranceTl.fromTo(
        academicRef.current,
        { x: vw * 0.6, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.55, ease: "back.out(2.5)" },
        0.18,
      );
      entranceTl.fromTo(
        achievementRef.current,
        { x: vw * 0.8, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "back.out(2.5)" },
        0.25,
      );

      /* ═══════════════════════════════════════════════════════════
         Phase 2 — PIN + HOLD + EXIT
         Once the section reaches the top it pins. The first ~70 %
         of pin-scroll is a hold (no tweens → cards stay assembled).
         The last 30 % is the exit animation.
         ═══════════════════════════════════════════════════════════ */
      const pinTl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=150%",
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });

      // 0 → 0.70  — hold (no tweens, grid is locked)

      // 0.70 → 1.0 — exit
      pinTl.to(headingRef.current, { opacity: 0, y: -20, duration: 0.12 }, 0.7);
      pinTl.to(
        allCards,
        { opacity: 0, y: -30, duration: 0.2, stagger: 0.02 },
        0.72,
      );

      // Force timeline length to 1.0 so hold/exit proportions are exact
      pinTl.addLabel("end", 1.0);
    }, section);

    return () => ctx.revert();
  }, []);

  /* ── Shared card shell ──
     ParticleCard handles hover transforms (tilt, magnetism),
     so CSS hover transforms are removed to avoid conflicts. */
  const card =
    "card card--border-glow border border-black/[0.04] backdrop-blur-md bg-white " +
    "shadow-[0_2px_5px_rgba(0,0,0,0.05),0_10px_20px_rgba(0,0,0,0.04),0_20px_40px_rgba(0,0,0,0.04)] " +
    "transition-all duration-300 group h-full rounded-2xl";

  const particleProps = {
    glowColor: GLOW_COLOR,
    enableTilt: true,
    enableMagnetism: true,
    clickEffect: true,
    particleCount: 8,
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
        enabled
        spotlightRadius={350}
        glowColor={GLOW_COLOR}
      />

      <div className="h-full flex flex-col pt-24 md:pt-0 md:justify-center px-4 md:px-12 max-w-6xl mx-auto">
        {/* ── Heading ── */}
        <div ref={headingRef} className="mb-3 md:mb-10 opacity-0">
          <h2 className="font-mono text-3xl md:text-6xl font-bold tracking-tighter text-black uppercase">
            About
          </h2>
          <div className="mt-1 md:mt-2 font-mono text-[9px] md:text-xs tracking-[0.3em] text-black/25 uppercase">
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
                <p className="font-mono text-xs md:text-base leading-relaxed text-black/50">
                  I came to Computer Science because I wanted to build things
                  that matter. That became a consistent thread of building
                  software for communities, tools that reduce friction, products
                  that reach people rather than just users.
                </p>
                <p className="font-mono text-xs md:text-base leading-relaxed text-black/50 mt-2 md:mt-4">
                  Outside of building, I lead, organize, and keep learning.
                  Currently picking up French. Always looking for the next
                  problem worth solving.
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
                <span className="block font-mono text-[8px] md:text-[10px] tracking-[0.25em] text-black/30 uppercase mt-2 md:mt-3">
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
                <p className="font-mono text-[9px] md:text-xs text-black/25 mt-0.5">
                  Ateneo de Manila University
                </p>
                <div className="flex gap-3 md:gap-4 mt-2 md:mt-3">
                  <div>
                    <span className="font-mono text-[7px] md:text-[9px] tracking-[0.25em] text-[#FFB800] uppercase font-semibold">
                      Year Level
                    </span>
                    <p className="font-mono text-[9px] md:text-xs text-black/50 mt-0.5">
                      2nd Year
                    </p>
                  </div>
                  <div>
                    <span className="font-mono text-[7px] md:text-[9px] tracking-[0.25em] text-[#FFB800] uppercase font-semibold">
                      Status
                    </span>
                    <p className="font-mono text-[9px] md:text-xs text-black/50 mt-0.5">
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
                <p className="font-mono text-[9px] md:text-xs text-black/25 mt-0.5">
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
