"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { CharacterV1, Bracket } from "@/components/ui/text-scroll-animation";

interface TechItem {
  name: string;
  tag: string;
  icon: string;
}

const CORE: TechItem[] = [
  { name: "Python", tag: "Scripting", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/python.svg" },
  { name: "Java", tag: "OOP", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/openjdk.svg" },
  { name: "TypeScript", tag: "Safety", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/typescript.svg" },
  { name: "Node.js", tag: "Runtime", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/nodedotjs.svg" },
];

const ECOSYSTEM: TechItem[] = [
  { name: "Next.js", tag: "Fullstack", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/nextdotjs.svg" },
  { name: "React", tag: "Library", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/react.svg" },
  { name: "Tailwind", tag: "Styling", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/tailwindcss.svg" },
  { name: "Vite", tag: "Build", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/vite.svg" },
  { name: "Git", tag: "Version", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/git.svg" },
  { name: "GitHub", tag: "Repo", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/github.svg" },
  { name: "Vercel", tag: "Deploy", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/vercel.svg" },
  { name: "Supabase", tag: "Database", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/supabase.svg" },
  { name: "Django", tag: "Web Framework", icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/django.svg" },
];

function TechCard({
  item,
  index,
  total,
  scrollYProgress,
}: {
  item: TechItem;
  index: number;
  total: number;
  scrollYProgress: any;
}) {
  const centerIndex = Math.floor(total / 2);
  const dist = index - centerIndex;

  const x = useTransform(scrollYProgress, [0, 0.5], [dist * 80, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [Math.abs(dist) * 40, 0]);
  const itemOpacity = useTransform(scrollYProgress, [0, 0.35], [0, 1]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.7, 1]);

  return (
    <motion.div
      style={{ x, y, opacity: itemOpacity, scale }}
      className="group relative flex flex-col items-center gap-2 p-4 md:p-5 border border-black/5 bg-white/60 backdrop-blur-sm hover:border-[#FFB800]/30 hover:bg-white/90 transition-colors duration-300 will-change-transform"
    >
      <img
        src={item.icon}
        alt={item.name}
        className="h-8 w-8 md:h-10 md:w-10 object-contain opacity-70 group-hover:opacity-100 transition-opacity duration-300"
      />
      <span className="font-mono text-xs md:text-sm font-bold tracking-wider text-black uppercase">
        {item.name}
      </span>
      <span className="font-mono text-[9px] md:text-[10px] tracking-[0.2em] text-[#FFB800] font-medium uppercase">
        {item.tag}
      </span>

      {/* Hover corner accents */}
      <div className="absolute top-1 left-1 w-2 h-2 border-t border-l border-[#FFB800]/0 group-hover:border-[#FFB800]/40 transition-colors duration-300" />
      <div className="absolute bottom-1 right-1 w-2 h-2 border-b border-r border-[#FFB800]/0 group-hover:border-[#FFB800]/40 transition-colors duration-300" />
    </motion.div>
  );
}

function CategoryBlock({
  label,
  items,
  scrollYProgress,
}: {
  label: string;
  items: TechItem[];
  scrollYProgress: any;
}) {
  const labelOpacity = useTransform(scrollYProgress, [0.1, 0.35], [0, 1]);
  const labelY = useTransform(scrollYProgress, [0.1, 0.35], [20, 0]);

  return (
    <div className="flex flex-col gap-5 md:gap-6">
      {/* Category header */}
      <motion.div
        style={{ opacity: labelOpacity, y: labelY }}
        className="flex items-center gap-3 font-mono"
      >
        <span className="w-2 h-2 bg-[#FFB800]" />
        <span className="text-xs md:text-sm tracking-[0.3em] font-bold text-black/50 uppercase">
          {label}
        </span>
        <div className="flex-grow h-[1px] bg-[#FFB800]/15" />
      </motion.div>

      {/* Cards grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">
        {items.map((item, i) => (
          <TechCard
            key={item.name}
            item={item}
            index={i}
            total={items.length}
            scrollYProgress={scrollYProgress}
          />
        ))}
      </div>
    </div>
  );
}

export default function Techstack() {
  const headingRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);
  const ecoRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: headingProgress } = useScroll({ target: headingRef });
  const { scrollYProgress: coreProgress } = useScroll({ target: coreRef });
  const { scrollYProgress: ecoProgress } = useScroll({ target: ecoRef });

  const headingText = "tech stack";
  const characters = headingText.split("");
  const centerIndex = Math.floor(characters.length / 2);

  return (
    <section id="techstack" className="relative w-full bg-[#f5f4f3]">
      {/* Block 1 — Heading scatter */}
      <div
        ref={headingRef}
        className="relative flex h-[180vh] items-center justify-center overflow-hidden px-6"
      >
        <div className="flex flex-col items-center gap-6">
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

      {/* Block 2 — Core & Languages */}
      <div
        ref={coreRef}
        className="relative -mt-[80vh] flex h-[180vh] items-center justify-center overflow-hidden px-6 md:px-12"
      >
        <div className="w-full max-w-5xl">
          <CategoryBlock
            label="Core & Languages"
            items={CORE}
            scrollYProgress={coreProgress}
          />
        </div>
      </div>

      {/* Block 3 — Ecosystem & Tools */}
      <div
        ref={ecoRef}
        className="relative -mt-[80vh] flex h-[180vh] items-center justify-center overflow-hidden px-6 md:px-12"
      >
        <div className="w-full max-w-5xl">
          <CategoryBlock
            label="Ecosystem & Tools"
            items={ECOSYSTEM}
            scrollYProgress={ecoProgress}
          />
        </div>
      </div>

      {/* Bottom connecting line */}
      <div className="h-24 flex items-center justify-center">
        <div className="w-[1px] h-full bg-gradient-to-b from-[#FFB800]/20 to-transparent" />
      </div>
    </section>
  );
}
