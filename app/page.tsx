"use client";

import ReactLenis from "lenis/react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import HeroTransition from "@/components/HeroTransition";
import Techstack from "@/components/Techstack";
import PillNav from "@/components/ui/PillNav";

const NAV_ITEMS = [
  { label: "Techstack", href: "#techstack" },
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const opacity = useTransform(scrollYProgress, [0.08, 0.14], [0, 1]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[1px] bg-[#FFB800] origin-left z-[60]"
      style={{ scaleX, opacity }}
    />
  );
}

function NavWrapper() {
  const { scrollYProgress } = useScroll();
  // Appears once hero is mostly wiped (after ~60% of hero scroll)
  const navOpacity = useTransform(scrollYProgress, [0.15, 0.22], [0, 1]);
  const navVisibility = useTransform(navOpacity, (v) =>
    v <= 0.01 ? ("hidden" as const) : ("visible" as const),
  );

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[1000] flex justify-center"
      style={{ opacity: navOpacity, visibility: navVisibility }}
    >
      <PillNav
        logo="/DexDev-Logo.svg"
        logoAlt="DexDev Logo"
        items={NAV_ITEMS}
        activeHref="#"
        baseColor="#000000"
        pillColor="#ffffff"
        hoveredPillTextColor="#ffffff"
        pillTextColor="#000000"
        initialLoadAnimation={false}
      />
    </motion.div>
  );
}

export default function Home() {
  return (
    <ReactLenis root>
      <ScrollProgressBar />
      <NavWrapper />
      <HeroTransition />
      <Techstack />
    </ReactLenis>
  );
}
