"use client";

import ReactLenis from "lenis/react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import HeroTransition from "@/components/HeroTransition";
import Techstack from "@/components/Techstack";

const NAV_ITEMS = [
  { label: "Tech Stack", href: "#techstack" },
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

function NavBar() {
  const { scrollYProgress } = useScroll();
  // Fades in exactly when the Hero HUD has fully disappeared (~0.2)
  const navOpacity = useTransform(scrollYProgress, [0.19, 0.26], [0, 1]);
  const navVisibility = useTransform(navOpacity, (v) =>
    v <= 0.01 ? ("hidden" as const) : ("visible" as const),
  );

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-[1000] bg-white/95 backdrop-blur-sm border-b border-black/[0.08]"
      style={{ opacity: navOpacity, visibility: navVisibility }}
    >
      <nav className="flex items-center justify-between px-6 md:px-12 h-12">
        <a
          href="#"
          className="font-mono text-[11px] md:text-sm font-semibold tracking-tight text-black uppercase"
        >
          Dexter Jethro Enriquez
        </a>
        <ul className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                className="font-mono text-[11px] tracking-[0.12em] text-black/50 uppercase hover:text-black transition-colors duration-200"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </motion.header>
  );
}

export default function Home() {
  return (
    <ReactLenis root>
      <ScrollProgressBar />
      <NavBar />
      <HeroTransition />
      <Techstack />
    </ReactLenis>
  );
}
