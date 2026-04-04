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
    offset: ["start start", "end start"],
  });

  // Sync motion value → ref for the R3F frame loop
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    scrollProgressRef.current = v;
  });

  // Hero container fades out at the tail end of the wipe
  const opacity = useTransform(scrollYProgress, [0.65, 0.9], [1, 0]);

  return (
    <div ref={containerRef} className="relative h-[250vh]">
      <div className="sticky top-0 h-screen">
        <motion.div
          style={{ opacity }}
          className="w-full h-full will-change-[opacity]"
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
