"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
} from "framer-motion";
import { CharacterV1, Bracket } from "@/components/ui/text-scroll-animation";

/* ── Data ── */

interface TechItem {
  name: string;
  tag: string;
  icon: string;
}

const REGISTRY: TechItem[] = [
  { name: "Python", tag: "CORE", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/python.svg" },
  { name: "Java", tag: "CORE", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/openjdk.svg" },
  { name: "TypeScript", tag: "CORE", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/typescript.svg" },
  { name: "Node.js", tag: "RUNTIME", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/nodedotjs.svg" },
  { name: "Next.js", tag: "FRAMEWORK", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/nextdotjs.svg" },
  { name: "React", tag: "FRAMEWORK", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/react.svg" },
  { name: "Django", tag: "FRAMEWORK", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/django.svg" },
  { name: "Tailwind", tag: "STYLING", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/tailwindcss.svg" },
  { name: "Vite", tag: "BUILD", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/vite.svg" },
  { name: "Git", tag: "VERSION", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/git.svg" },
  { name: "GitHub", tag: "PLATFORM", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/github.svg" },
  { name: "Vercel", tag: "DEPLOY", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/vercel.svg" },
  { name: "Supabase", tag: "DATABASE", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/supabase.svg" },
];

/* ── Tech Module ── */

function TechModule({ item, index }: { item: TechItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.4,
        delay: index * 0.04,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group flex items-center gap-3 md:gap-4 p-4 md:p-5 cursor-default"
    >
      {/* Monochromatic logo → amber on hover */}
      <img
        src={item.icon}
        alt={item.name}
        className="h-5 w-5 md:h-6 md:w-6 object-contain opacity-40 grayscale group-hover:opacity-100 group-hover:grayscale-0 group-hover:[filter:brightness(0)_saturate(100%)_invert(73%)_sepia(58%)_saturate(1000%)_hue-rotate(5deg)_brightness(103%)] transition-all duration-300"
      />

      {/* Name + tag */}
      <div className="flex flex-col gap-0.5 min-w-0">
        <span className="font-mono text-xs md:text-sm font-bold tracking-wider text-black/80 uppercase truncate group-hover:text-[#FFB800] transition-colors duration-300">
          {item.name}
        </span>
        <span className="font-mono text-[8px] md:text-[9px] tracking-[0.2em] text-black/20 uppercase">
          [ {item.tag} ]
        </span>
      </div>
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

  // Split registry into rows of 4 for bottom borders
  const rows: TechItem[][] = [];
  for (let i = 0; i < REGISTRY.length; i += 4) {
    rows.push(REGISTRY.slice(i, i + 4));
  }

  return (
    <section id="techstack" className="relative w-full bg-white">
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
        </div>
      </div>

      {/* Block 2 — 4-Column Registry Grid */}
      <div className="relative -mt-[40vh] px-6 md:px-12 pb-32">
        <div className="mx-auto max-w-4xl">
          {/* Section label */}
          <div className="font-mono text-[10px] md:text-xs tracking-[0.25em] text-black/25 uppercase mb-8 flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-[#FFB800]" />
            <span>System Registry</span>
            <div className="flex-grow h-[1px] bg-black/[0.06]" />
            <span className="text-[#FFB800]/60 font-bold tabular-nums">
              {REGISTRY.length}
            </span>
          </div>

          {/* Grid with 1px row borders */}
          {rows.map((row, rowIdx) => (
            <div
              key={rowIdx}
              className="grid grid-cols-2 md:grid-cols-4 border-b border-black/[0.06]"
            >
              {row.map((item, colIdx) => (
                <TechModule
                  key={item.name}
                  item={item}
                  index={rowIdx * 4 + colIdx}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
