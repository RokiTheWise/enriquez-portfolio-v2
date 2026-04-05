"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import Hero from "@/components/Hero";
import Techstack from "@/components/Techstack";

export default function HeroTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Sync motion value → ref for the R3F frame loop
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    scrollProgressRef.current = v;
  });

  // ── Mutually exclusive layers ──
  // Tech stack fades in
  const techOpacity = useTransform(scrollYProgress, [0.37, 0.55], [0, 1]);
  // Hero fades out (starts after tech begins appearing, done before tech is solid)
  const heroOpacity = useTransform(scrollYProgress, [0.4, 0.65], [1, 0]);

  // visibility: hidden when fully transparent — prevents ghost rendering
  const heroVisibility = useTransform(heroOpacity, (v) => v <= 0.01 ? "hidden" as const : "visible" as const);
  const techVisibility = useTransform(techOpacity, (v) => v <= 0.01 ? "hidden" as const : "visible" as const);

  // Pointer-events lockdown: only the active layer receives events
  const heroPointerEvents = useTransform(heroOpacity, (v) => v <= 0.01 ? "none" as const : "auto" as const);
  const techPointerEvents = useTransform(techOpacity, (v) => v > 0.1 ? "auto" as const : "none" as const);

  // Z-index: tech rises above hero once it's mostly visible
  const techZ = useTransform(scrollYProgress, (v) => v > 0.5 ? 10 : 0);
  const heroZ = useTransform(scrollYProgress, (v) => v > 0.5 ? -1 : 0);

  return (
    <div ref={containerRef} className="relative h-[250vh]">
      {/* Pinned viewport */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Hero layer — fully cleared after transition */}
        <motion.div
          style={{ opacity: heroOpacity, visibility: heroVisibility, pointerEvents: heroPointerEvents, zIndex: heroZ }}
          className="absolute inset-0"
        >
          <Hero scrollProgressRef={scrollProgressRef} scrollYProgress={scrollYProgress} />
        </motion.div>

        {/* Tech stack layer — slides in from right, becomes sole active interface */}
        <motion.div
          style={{
            opacity: techOpacity,
            visibility: techVisibility,
            pointerEvents: techPointerEvents,
            zIndex: techZ,
            x: useTransform(scrollYProgress, [0.37, 0.6], [60, 0]),
          }}
          className="absolute inset-0"
        >
          <Techstack scrollYProgress={scrollYProgress} />
        </motion.div>
      </div>
    </div>
  );
}
