"use client";

import ReactLenis from "lenis/react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import HeroTransition from "@/components/HeroTransition";
import Techstack from "@/components/Techstack";

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  // Fade in after hero section (~10-15% of total page scroll)
  const opacity = useTransform(scrollYProgress, [0.08, 0.14], [0, 1]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[1px] bg-[#FFB800] origin-left z-[60]"
      style={{ scaleX, opacity }}
    />
  );
}

export default function Home() {
  return (
    <ReactLenis root>
      <ScrollProgressBar />
      <HeroTransition />
      <Techstack />
    </ReactLenis>
  );
}
