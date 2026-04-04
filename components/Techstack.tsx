"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import { CharacterV1, Bracket } from "@/components/ui/text-scroll-animation";

/* ── Registry data ── */

interface TechItem {
  name: string;
  tag: string;
}

const REGISTRY: TechItem[] = [
  { name: "Python", tag: "CORE" },
  { name: "Java", tag: "CORE" },
  { name: "TypeScript", tag: "CORE" },
  { name: "Node.js", tag: "RUNTIME" },
  { name: "Next.js", tag: "FRAMEWORK" },
  { name: "React", tag: "FRAMEWORK" },
  { name: "Django", tag: "FRAMEWORK" },
  { name: "Tailwind", tag: "STYLING" },
  { name: "Vite", tag: "BUILD" },
  { name: "Git", tag: "VERSION" },
  { name: "GitHub", tag: "PLATFORM" },
  { name: "Vercel", tag: "DEPLOY" },
  { name: "Supabase", tag: "DATABASE" },
];

/* ── Tech Module ── */

function TechModule({ item, index }: { item: TechItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -15, skewX: -3 }}
      animate={
        isInView
          ? {
              opacity: [0, 0.4, 0, 1],
              x: [-15, -4, 0],
              skewX: [-3, -1, 0],
            }
          : {}
      }
      transition={{
        duration: 0.5,
        delay: index * 0.04,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative border border-black/10 bg-[#f5f4f3] p-4 md:p-5 font-mono transition-all duration-300 hover:border-[#FFB800] cursor-default"
    >
      {/* Status indicator + name */}
      <div className="flex items-center gap-2.5 mb-1.5">
        <span className="w-1 h-1 flex-shrink-0 bg-[#FFB800] shadow-[0_0_6px_rgba(255,184,0,0.6)]" />
        <span className="text-xs md:text-sm font-bold tracking-wider text-black uppercase truncate">
          {item.name}
        </span>
      </div>

      {/* Category tag */}
      <div className="text-[9px] md:text-[10px] tracking-[0.2em] text-black/35 uppercase pl-3.5">
        [ {item.tag} ]
      </div>

      {/* Hover crosshair / corner brackets */}
      <div className="absolute top-1.5 left-1.5 w-2.5 h-2.5 border-t border-l border-[#FFB800]/0 group-hover:border-[#FFB800] transition-all duration-200" />
      <div className="absolute top-1.5 right-1.5 w-2.5 h-2.5 border-t border-r border-[#FFB800]/0 group-hover:border-[#FFB800] transition-all duration-200" />
      <div className="absolute bottom-1.5 left-1.5 w-2.5 h-2.5 border-b border-l border-[#FFB800]/0 group-hover:border-[#FFB800] transition-all duration-200" />
      <div className="absolute bottom-1.5 right-1.5 w-2.5 h-2.5 border-b border-r border-[#FFB800]/0 group-hover:border-[#FFB800] transition-all duration-200" />
    </motion.div>
  );
}

/* ── Main Section ── */

export default function Techstack() {
  const headingRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: headingProgress } = useScroll({
    target: headingRef,
  });

  const headingText = "tech stack";
  const characters = headingText.split("");
  const centerIndex = Math.floor(characters.length / 2);

  return (
    <section id="techstack" className="relative w-full bg-[#f5f4f3]">
      {/* Block 1 — Heading scatter */}
      <div
        ref={headingRef}
        className="relative flex h-[140vh] items-center justify-center overflow-hidden px-6"
      >
        <div className="flex flex-col items-center gap-5">
          <div
            className="w-full text-center font-mono text-5xl sm:text-6xl md:text-8xl font-bold uppercase tracking-tighter text-black"
            style={{ perspective: "500px" }}
          >
            {characters.map((char, i) => (
              <CharacterV1
                key={i}
                char={char}
                index={i}
                centerIndex={centerIndex}
                scrollYProgress={headingProgress}
              />
            ))}
          </div>

          <motion.p
            className="flex items-center gap-3 font-mono text-base md:text-xl tracking-tight text-black/40"
            style={{
              opacity: useTransform(headingProgress, [0.3, 0.5], [0, 1]),
            }}
          >
            <Bracket className="h-6 md:h-10 text-[#FFB800]" />
            <span>tools I build with</span>
            <Bracket className="h-6 md:h-10 scale-x-[-1] text-[#FFB800]" />
          </motion.p>

          {/* Registry subtitle */}
          <motion.div
            className="font-mono text-[10px] md:text-xs tracking-[0.3em] text-black/25 uppercase"
            style={{
              opacity: useTransform(headingProgress, [0.35, 0.55], [0, 1]),
            }}
          >
            ── System Registry v1.0 ──
          </motion.div>
        </div>
      </div>

      {/* Block 2 — Registry Grid */}
      <div className="relative -mt-[50vh] px-6 md:px-12 pb-24">
        <div className="mx-auto max-w-4xl">
          {/* Section label */}
          <div className="font-mono text-[10px] md:text-xs tracking-[0.25em] text-black/35 uppercase mb-6 flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-[#FFB800]" />
            <span>Registered Modules</span>
            <div className="flex-grow h-[1px] bg-black/5" />
            <span className="text-[#FFB800] font-bold tabular-nums">
              {REGISTRY.length}
            </span>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
            {REGISTRY.map((item, i) => (
              <TechModule key={item.name} item={item} index={i} />
            ))}
          </div>

          {/* Bottom status line */}
          <div className="mt-8 flex items-center gap-3 font-mono text-[9px] md:text-[10px] tracking-[0.15em] text-black/25 uppercase">
            <div className="flex-grow h-[1px] bg-black/5" />
            <span>all systems nominal</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-pulse shadow-[0_0_6px_rgba(204,255,0,0.4)]" />
          </div>
        </div>
      </div>

      {/* Bottom connecting line */}
      <div className="h-24 flex items-center justify-center">
        <div className="w-[1px] h-full bg-gradient-to-b from-[#FFB800]/20 to-transparent" />
      </div>
    </section>
  );
}
