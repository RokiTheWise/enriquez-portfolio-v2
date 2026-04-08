"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const bioRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);
  const academicRef = useRef<HTMLDivElement>(null);
  const achievementRef = useRef<HTMLDivElement>(null);
  const interestsRef = useRef<HTMLDivElement>(null);

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
         Phase 1 — ENTRANCE (no pin)
         Plays while the section scrolls from viewport-bottom → top.
         Cards assemble during the natural scroll, so there is ZERO
         dead white space after the hero.
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

      // Bio — center, scale up + fade
      entranceTl.fromTo(
        bioRef.current,
        { opacity: 0, scale: 0.88 },
        { opacity: 1, scale: 1, duration: 0.6 },
        0.1,
      );

      // Left cards — parallax from left
      entranceTl.fromTo(
        metricsRef.current,
        { x: -vw * 0.6, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.55 },
        0.15,
      );
      entranceTl.fromTo(
        interestsRef.current,
        { x: -vw * 0.8, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6 },
        0.22,
      );

      // Right cards — parallax from right
      entranceTl.fromTo(
        academicRef.current,
        { x: vw * 0.6, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.55 },
        0.18,
      );
      entranceTl.fromTo(
        achievementRef.current,
        { x: vw * 0.8, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6 },
        0.25,
      );

      /* ═══════════════════════════════════════════════════════════
         Phase 2 — PIN + HOLD + EXIT
         Once the section reaches the top it pins. The first ~70 %
         of pin-scroll is a hold (no tweens → cards stay assembled).
         The last 30 % is the exit animation. Tech Stack can only
         appear after the pin releases.
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
      pinTl.to(
        headingRef.current,
        { opacity: 0, y: -20, duration: 0.12 },
        0.70,
      );
      pinTl.to(
        allCards,
        { opacity: 0, y: -30, duration: 0.20, stagger: 0.02 },
        0.72,
      );

      // Force timeline length to 1.0 so hold/exit proportions are exact
      pinTl.addLabel("end", 1.0);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative h-screen bg-white overflow-hidden"
    >
      <div className="h-full flex flex-col justify-center px-6 md:px-12 max-w-6xl mx-auto">
        {/* ── Heading ── */}
        <div ref={headingRef} className="mb-8 md:mb-10 opacity-0">
          <h2 className="font-mono text-4xl md:text-6xl font-bold tracking-tighter text-black uppercase">
            About
          </h2>
          <div className="mt-2 font-mono text-[10px] md:text-xs tracking-[0.3em] text-black/25 uppercase">
            Profile Overview
          </div>
        </div>

        {/* ── Bento Grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {/* Bio — center, 2x2 on desktop */}
          <div
            ref={bioRef}
            className="col-span-2 md:col-start-2 md:col-end-4 md:row-span-2 border border-black/[0.08] p-6 md:p-8 flex flex-col justify-center hover:border-[#FFB800] transition-colors duration-300 group opacity-0"
          >
            <div className="group-hover:-translate-y-1 transition-transform duration-300">
              <p className="font-mono text-sm md:text-base leading-relaxed text-black/50">
                I came to Computer Science because I wanted to build things that
                matter. That became a consistent thread of building software for
                communities, tools that reduce friction, products that reach
                people rather than just users.
              </p>
            </div>
          </div>

          {/* Metrics — top-left */}
          <div
            ref={metricsRef}
            className="md:col-start-1 md:row-start-1 border border-black/[0.08] p-5 md:p-6 flex flex-col justify-center items-center hover:border-[#FFB800] transition-colors duration-300 group opacity-0"
          >
            <div className="group-hover:-translate-y-1 transition-transform duration-300 text-center">
              <span className="font-mono text-4xl md:text-5xl font-bold tracking-tighter text-black">
                3.72
              </span>
              <span className="block font-mono text-[9px] md:text-[10px] tracking-[0.25em] text-black/30 uppercase mt-1">
                Cumulative QPI
              </span>
            </div>
          </div>

          {/* Interests — bottom-left */}
          <div
            ref={interestsRef}
            className="md:col-start-1 md:row-start-2 border border-black/[0.08] p-5 md:p-6 flex flex-col justify-center hover:border-[#FFB800] transition-colors duration-300 group opacity-0"
          >
            <div className="group-hover:-translate-y-1 transition-transform duration-300">
              <span className="font-mono text-[9px] md:text-[10px] tracking-[0.2em] text-[#FFB800] uppercase font-semibold">
                Interests
              </span>
              <p className="font-mono text-xs md:text-sm text-black/60 mt-2 leading-relaxed">
                Civic Tech, Basketball, Philippine History
              </p>
            </div>
          </div>

          {/* Academic — top-right */}
          <div
            ref={academicRef}
            className="md:col-start-4 md:row-start-1 border border-black/[0.08] p-5 md:p-6 flex flex-col justify-center hover:border-[#FFB800] transition-colors duration-300 group opacity-0"
          >
            <div className="group-hover:-translate-y-1 transition-transform duration-300">
              <span className="font-mono text-[9px] md:text-[10px] tracking-[0.2em] text-[#FFB800] uppercase font-semibold">
                Education
              </span>
              <p className="font-mono text-xs md:text-sm font-bold text-black/80 mt-2">
                BS Computer Science
              </p>
              <p className="font-mono text-[10px] md:text-xs text-black/40 mt-0.5">
                Ateneo de Manila University
              </p>
              <p className="font-mono text-[10px] md:text-xs text-black/30 mt-0.5">
                2nd Year
              </p>
            </div>
          </div>

          {/* Achievement — bottom-right */}
          <div
            ref={achievementRef}
            className="md:col-start-4 md:row-start-2 border border-black/[0.08] p-5 md:p-6 flex flex-col justify-center hover:border-[#FFB800] transition-colors duration-300 group opacity-0"
          >
            <div className="group-hover:-translate-y-1 transition-transform duration-300">
              <span className="font-mono text-[9px] md:text-[10px] tracking-[0.2em] text-[#FFB800] uppercase font-semibold">
                Scholarships
              </span>
              <p className="font-mono text-xs md:text-sm font-bold text-black/80 mt-2">
                Jose P. Rizal & EO-Ayala Scholar
              </p>
              <p className="font-mono text-[10px] md:text-xs text-black/40 mt-0.5">
                Full University & Corporate Merit
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
