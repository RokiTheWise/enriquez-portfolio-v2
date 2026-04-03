"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Hero from "@/components/Hero";

export default function HeroTransition() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Phase 1 (0 → 0.45): Compress to square + round corners
  const scale = useTransform(scrollYProgress, [0, 0.45, 0.75], [1, 0.55, 0.45]);
  const borderRadius = useTransform(scrollYProgress, [0, 0.45], ["0px", "24px"]);

  // Phase 2 (0.45 → 0.75): Flip out on Y-axis
  const rotateY = useTransform(scrollYProgress, [0.45, 0.75], [0, 90]);
  const opacity = useTransform(scrollYProgress, [0.6, 0.75], [1, 0]);

  return (
    <div ref={containerRef} className="relative h-[250vh]">
      <div className="sticky top-0 h-screen flex items-center justify-center" style={{ perspective: "1200px" }}>
        <motion.div
          style={{
            scale,
            borderRadius,
            rotateY,
            opacity,
          }}
          className="w-full h-full origin-center overflow-hidden shadow-[0_0_0px_rgba(0,0,0,0)] will-change-transform"
        >
          <Hero />
        </motion.div>
      </div>
    </div>
  );
}
