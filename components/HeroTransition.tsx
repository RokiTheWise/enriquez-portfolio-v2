"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";
import Hero from "@/components/Hero";

export default function HeroTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Sync motion value → ref for the R3F frame loop
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    scrollProgressRef.current = v;
  });

  // Hero stays visible while particles self-fade via shader (0.85→1.0),
  // then gets removed entirely at scroll completion.
  const heroVisibility = useTransform(scrollYProgress, (v) =>
    v >= 0.99 ? ("hidden" as const) : ("visible" as const),
  );

  return (
    <div ref={containerRef} className="relative h-[200vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div
          style={{ visibility: heroVisibility }}
          className="absolute inset-0"
        >
          <Hero
            scrollProgressRef={scrollProgressRef}
            scrollYProgress={scrollYProgress}
          />
        </motion.div>
      </div>
    </div>
  );
}
