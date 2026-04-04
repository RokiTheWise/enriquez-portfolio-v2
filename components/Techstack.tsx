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

interface TechCategory {
  label: string;
  items: { name: string; tag: string }[];
}

const CATEGORIES: TechCategory[] = [
  {
    label: "CORE",
    items: [
      { name: "Python", tag: "LANG" },
      { name: "Java", tag: "LANG" },
      { name: "TypeScript", tag: "LANG" },
    ],
  },
  {
    label: "RUNTIME",
    items: [{ name: "Node.js", tag: "ENV" }],
  },
  {
    label: "FRAMEWORKS",
    items: [
      { name: "Next.js", tag: "FULLSTACK" },
      { name: "React", tag: "UI" },
      { name: "Django", tag: "BACKEND" },
    ],
  },
  {
    label: "STYLING",
    items: [{ name: "Tailwind", tag: "CSS" }],
  },
  {
    label: "TOOLING",
    items: [
      { name: "Vite", tag: "BUILD" },
      { name: "Git", tag: "VCS" },
      { name: "GitHub", tag: "PLATFORM" },
    ],
  },
  {
    label: "INFRASTRUCTURE",
    items: [
      { name: "Vercel", tag: "DEPLOY" },
      { name: "Supabase", tag: "BAAS" },
    ],
  },
];

// Asymmetric left-offset pattern (percentage) for organic flow
const OFFSETS = [6, 42, 22, 55, 14, 48, 30, 60, 10, 38, 52, 18, 45];

/* ── Stream Item ── */

function StreamItem({
  name,
  tag,
  globalIndex,
}: {
  name: string;
  tag: string;
  globalIndex: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });
  const offset = OFFSETS[globalIndex % OFFSETS.length];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{
        duration: 0.6,
        delay: 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="py-3 md:py-4 cursor-default group"
      style={{ paddingLeft: `${offset}%` }}
    >
      <div className="flex items-baseline gap-3 md:gap-4">
        {/* Status indicator */}
        <span className="relative top-[-1px] w-1 h-1 flex-shrink-0 bg-[#FFB800] shadow-[0_0_6px_rgba(255,184,0,0.5)] group-hover:shadow-[0_0_12px_rgba(255,184,0,0.8)] transition-shadow duration-300" />

        {/* Name */}
        <span className="font-mono text-lg md:text-2xl font-bold tracking-wide text-black uppercase group-hover:text-[#FFB800] transition-colors duration-300">
          {name}
        </span>

        {/* Tag */}
        <span className="font-mono text-[9px] md:text-[10px] tracking-[0.2em] text-black/25 uppercase">
          {tag}
        </span>
      </div>
    </motion.div>
  );
}

/* ── Category Divider ── */

function CategoryDivider({ label }: { label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : {}}
      transition={{ duration: 0.8 }}
      className="flex items-center gap-4 py-6 md:py-8"
    >
      <div className="flex-grow h-[1px] bg-black/[0.06]" />
      <span className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-black/20 uppercase flex-shrink-0">
        {label}
      </span>
      <div className="flex-grow h-[1px] bg-black/[0.06]" />
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

  // Build flat stream with running global index
  let globalIndex = 0;

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

      {/* Block 2 — Vertical Data Stream */}
      <div className="relative -mt-[40vh] px-6 md:px-12 pb-32">
        <div className="mx-auto max-w-3xl">
          {CATEGORIES.map((cat, catIdx) => {
            const items = cat.items.map((item) => {
              const idx = globalIndex++;
              return (
                <StreamItem
                  key={item.name}
                  name={item.name}
                  tag={item.tag}
                  globalIndex={idx}
                />
              );
            });

            return (
              <div key={cat.label}>
                {catIdx > 0 && <CategoryDivider label={cat.label} />}
                {catIdx === 0 && <CategoryDivider label={cat.label} />}
                {items}
              </div>
            );
          })}

          {/* Terminal line */}
          <div className="mt-12 flex items-center gap-4">
            <div className="flex-grow h-[1px] bg-black/[0.06]" />
            <span className="font-mono text-[9px] tracking-[0.15em] text-black/15 uppercase">
              end of stream
            </span>
            <span className="w-1 h-1 rounded-full bg-[#FFB800]/40" />
          </div>
        </div>
      </div>
    </section>
  );
}
