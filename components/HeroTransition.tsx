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

  // Tech stack layer opacity: materializes as mask hits ~80%
  const techOpacity = useTransform(scrollYProgress, [0.37, 0.55], [0, 1]);
  // Hero layer fades out so only Techstack remains at full scroll
  const heroOpacity = useTransform(scrollYProgress, [0.5, 0.7], [1, 0]);

  return (
    <div ref={containerRef} className="relative h-[250vh]">
      {/* Pinned viewport — nothing moves on screen */}
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Hero layer: fades out completely */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <Hero scrollProgressRef={scrollProgressRef} scrollYProgress={scrollYProgress} />
        </motion.div>

        {/* Tech stack layer: materializes on top, pointer-events only when visible */}
        <motion.div
          style={{ opacity: techOpacity, pointerEvents: useTransform(techOpacity, (v) => v > 0.1 ? "auto" : "none") }}
          className="absolute inset-0 z-10"
        >
          <Techstack scrollYProgress={scrollYProgress} />
        </motion.div>
      </div>
    </div>
  );
}
