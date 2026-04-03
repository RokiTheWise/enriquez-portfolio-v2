"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  CharacterV1,
  CharacterV3,
  Bracket,
} from "@/components/ui/text-scroll-animation";

const TECH_ICONS = [
  "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/react.svg",
  "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/nextdotjs.svg",
  "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/typescript.svg",
  "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/threedotjs.svg",
  "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/tailwindcss.svg",
  "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/nodedotjs.svg",
  "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/postgresql.svg",
  "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/figma.svg",
];

export default function Techstack() {
  const textRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress: textProgress } = useScroll({ target: textRef });
  const { scrollYProgress: iconsProgress } = useScroll({ target: iconsRef });

  const text = "my tech stack";
  const characters = text.split("");
  const centerIndex = Math.floor(characters.length / 2);
  const iconCenterIndex = Math.floor(TECH_ICONS.length / 2);

  return (
    <section id="techstack" className="relative w-full bg-[#f5f4f3]">
      {/* Block 1 — Text reveal */}
      <div
        ref={textRef}
        className="relative box-border flex h-[200vh] items-center justify-center overflow-hidden px-6"
      >
        <div
          className="w-full max-w-4xl text-center font-mono text-4xl sm:text-5xl md:text-7xl font-bold uppercase tracking-tighter text-black"
          style={{ perspective: "500px" }}
        >
          {characters.map((char, index) => (
            <CharacterV1
              key={index}
              char={char}
              index={index}
              centerIndex={centerIndex}
              scrollYProgress={textProgress}
            />
          ))}
        </div>
      </div>

      {/* Block 2 — Icons scatter-in */}
      <div
        ref={iconsRef}
        className="relative -mt-[100vh] box-border flex h-[200vh] flex-col items-center justify-center gap-6 overflow-hidden px-6"
      >
        <p className="flex items-center justify-center gap-3 font-mono text-lg md:text-2xl font-medium tracking-tight text-black">
          <Bracket className="h-8 md:h-12 text-[#FFB800]" />
          <span>tools I build with</span>
          <Bracket className="h-8 md:h-12 scale-x-[-1] text-[#FFB800]" />
        </p>

        <div
          className="flex flex-wrap items-center justify-center gap-6 md:gap-8"
          style={{ perspective: "500px" }}
        >
          {TECH_ICONS.map((src, index) => (
            <CharacterV3
              key={index}
              char={src}
              index={index}
              centerIndex={iconCenterIndex}
              scrollYProgress={iconsProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
