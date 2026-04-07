"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

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
      initial={{ opacity: 0, y: 15 }}
      animate={isInView ? { opacity: 1, y: 0 } : undefined}
      transition={{
        duration: 0.5,
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
  const headingInView = useInView(headingRef, { once: true, margin: "-80px" });

  // Split into rows of 4 for bottom borders
  const rows: TechItem[][] = [];
  for (let i = 0; i < REGISTRY.length; i += 4) {
    rows.push(REGISTRY.slice(i, i + 4));
  }

  return (
    <section
      id="techstack"
      className="relative w-full bg-white px-6 md:px-12 py-24 md:py-32"
    >
      {/* Section header */}
      <motion.div
        ref={headingRef}
        initial={{ opacity: 0, y: 20 }}
        animate={headingInView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-10 md:mb-14 text-center"
      >
        <h2 className="font-mono text-4xl md:text-6xl font-bold tracking-tighter text-black uppercase">
          Tech Stack
        </h2>
        <div className="mt-3 font-mono text-[10px] md:text-xs tracking-[0.3em] text-black/25 uppercase">
          System Registry
        </div>
      </motion.div>

      {/* 4-Column Registry Grid */}
      <div className="w-full max-w-4xl mx-auto">
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
    </section>
  );
}
