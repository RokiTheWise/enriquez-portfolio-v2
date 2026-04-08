"use client";

import ReactLenis from "lenis/react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import HeroTransition from "@/components/HeroTransition";
import About from "@/components/About";
import Techstack from "@/components/Techstack";

const NAV_ITEMS = [
  { label: "About", href: "#about" },
  { label: "Tech Stack", href: "#techstack" },
  { label: "Projects", href: "#projects" },
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
  // Pixel-based scroll — immune to GSAP pin-spacer height changes.
  // Hero HUD fades at scrollP 0.02→0.20 within a 150vh container (50vh scroll),
  // so HUD is gone by ~100px. Navbar fades in at 100→300px and stays forever.
  const { scrollY } = useScroll();
  const navOpacity = useTransform(scrollY, [100, 300], [0, 1]);
  const navPointerEvents = useTransform(navOpacity, (v) =>
    v > 0.01 ? ("auto" as const) : ("none" as const),
  );

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-[1000] bg-white/95 backdrop-blur-sm border-b border-black/[0.08]"
      style={{ opacity: navOpacity, pointerEvents: navPointerEvents }}
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
      <About />
      <Techstack />
    </ReactLenis>
  );
}
