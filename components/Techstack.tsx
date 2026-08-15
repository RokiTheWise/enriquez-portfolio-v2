"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import LogoLoop from "./LogoLoop";
import { DUR, EASE } from "@/lib/motion";

/* ── Data ── */

interface TechItem {
  name: string;
  icon: string;
}

interface TechCategory {
  label: string;
  tag: string;
  items: TechItem[];
}

const CATEGORIES: TechCategory[] = [
  {
    label: "Languages",
    tag: "LANG",
    items: [
      {
        name: "Python",
        icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/python.svg",
      },
      {
        name: "Java",
        icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/coffeescript.svg",
      },
      {
        name: "JavaScript",
        icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/javascript.svg",
      },
      {
        name: "TypeScript",
        icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/typescript.svg",
      },
    ],
  },
  {
    label: "Architecture",
    tag: "ARCH",
    items: [
      {
        name: "Node.js",
        icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/nodedotjs.svg",
      },
      {
        name: "Next.js",
        icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/nextdotjs.svg",
      },
      {
        name: "React",
        icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/react.svg",
      },
      {
        name: "Django",
        icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/django.svg",
      },
      {
        name: "Tailwind",
        icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/tailwindcss.svg",
      },
      {
        name: "Vite",
        icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/vite.svg",
      },
    ],
  },
  {
    label: "Ecosystem & OPS",
    tag: "OPS",
    items: [
      {
        name: "Git",
        icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/git.svg",
      },
      {
        name: "GitHub",
        icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/github.svg",
      },
      {
        name: "Vercel",
        icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/vercel.svg",
      },
      {
        name: "Supabase",
        icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/supabase.svg",
      },
      {
        name: "PostgreSQL",
        icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/postgresql.svg",
      },
      {
        name: "GSC",
        icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/googlesearchconsole.svg",
      },
      {
        name: "Cloudflare",
        icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/cloudflare.svg",
      },
    ],
  },
  {
    label: "Data",
    tag: "DATA",
    items: [
      {
        name: "NumPy",
        icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/numpy.svg",
      },
      {
        name: "pandas",
        icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/pandas.svg",
      },
      {
        /* simple-icons has no matplotlib mark (no permissive brand asset), so
           this reuses the Python glyph rather than 404ing like the others. */
        name: "Matplotlib",
        icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/python.svg",
      },
      {
        /* SQL is a language, not a brand — PostgreSQL is the dialect actually
           used here (see Supabase above), so its mark stands in. */
        name: "SQL",
        icon: "https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/postgresql.svg",
      },
    ],
  },
];

const REGISTRY = CATEGORIES.flatMap((cat) => cat.items);

const loopLogos = REGISTRY.map((item) => ({
  src: item.icon,
  alt: item.name,
  title: item.name,
}));

/* ── Tech Module ── */

function TechModule({
  item,
  index,
  columns,
}: {
  item: TechItem;
  index: number;
  columns: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const reducedMotion = useReducedMotion();

  /*
   * Stagger diagonally from the top-left rather than by flat index. A running
   * counter across a multi-column grid zig-zags in reading order (col1, col2,
   * col3, back to col1) instead of sweeping in one direction; keying the delay
   * off row + column makes the ripple travel the way the eye expects.
   */
  const row = Math.floor(index / columns);
  const col = index % columns;
  const delay = (row + col) * 0.03;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: reducedMotion ? 0 : 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : undefined}
      transition={{
        duration: DUR.base,
        // Stagger is decorative; collapse it under reduced motion so the grid
        // simply appears rather than rippling.
        delay: reducedMotion ? 0 : delay,
        ease: EASE,
      }}
      className="group flex items-center gap-2 py-3 px-1 cursor-default"
    >
      <img
        src={item.icon}
        alt={item.name}
        className="h-5 w-5 md:h-6 md:w-6 object-contain opacity-40 grayscale group-hover:opacity-100 group-hover:grayscale-0 group-hover:[filter:brightness(0)_saturate(100%)_invert(73%)_sepia(58%)_saturate(1000%)_hue-rotate(5deg)_brightness(103%)] transition-[opacity,filter] duration-300"
      />
      <span className="font-mono text-xs md:text-[13px] lg:text-sm font-bold tracking-tight lg:tracking-wider text-black/80 uppercase truncate group-hover:text-[#FFB800] transition-colors duration-300">
        {item.name}
      </span>
    </motion.div>
  );
}

/* ── Main Section ── */

export default function Techstack() {
  const headingRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-80px" });
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="techstack"
      className="relative w-full bg-white h-screen flex flex-col pt-20 pb-20 md:pt-0 md:pb-0"
    >
      {/* Top LogoLoop — pinned to top, below nav clearance */}
      <div className="relative overflow-hidden h-10 md:h-12 [&_img]:opacity-[0.12]">
        <LogoLoop
          logos={loopLogos}
          speed={50}
          direction="left"
          logoHeight={24}
          gap={56}
          fadeOut
          fadeOutColor="#ffffff"
          ariaLabel="Tech stack technologies"
        />
      </div>

      {/* Center content — fills remaining space */}
      <div className="flex-1 flex flex-col justify-center py-10 md:py-16">
        {/* Section header */}
        <motion.div
          ref={headingRef}
          initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
          animate={headingInView ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: DUR.base, ease: EASE }}
          className="mb-10 md:mb-16 text-center px-6 md:px-12"
        >
          <h2 className="font-mono text-4xl md:text-6xl font-bold tracking-display-md md:tracking-display-lg text-black uppercase">
            Tech Stack
          </h2>
          <div className="mt-3 font-mono text-[10px] md:text-xs tracking-[0.3em] text-black/25 uppercase">
            System Registry
          </div>
        </motion.div>

        {/* Desktop: 3 major columns with 2-col sub-grids + dividers */}
        {/* One column per category — 4 across on desktop. Padding is kept
            tight so each column's 2-wide item grid has room for the longest
            names (JavaScript, PostgreSQL, Matplotlib) without truncating. */}
        <div className="hidden md:grid w-full px-3 lg:px-6 xl:px-10 grid-cols-4">
          {CATEGORIES.map((cat, catIdx) => (
            <div
              key={cat.tag}
              className={`px-4 lg:px-6${catIdx < CATEGORIES.length - 1 ? " border-r border-black/[0.06]" : ""}`}
            >
              <div className="font-mono text-[10px] md:text-xs tracking-[0.3em] text-black/25 uppercase mb-5 pb-3 border-b border-black/[0.06]">
                {cat.label}
              </div>
              {/* Single column until there is room for two: 4 categories × 2
                  sub-columns is 8 names across, which only fits ≥1440px. */}
              <div className="grid grid-cols-1 2xl:grid-cols-2 gap-y-1 gap-x-4">
                {/* Index is per-category so each 2-column sub-grid sweeps
                    from its own top-left. */}
                {cat.items.map((item, itemIdx) => (
                  <TechModule
                    key={item.name}
                    item={item}
                    index={itemIdx}
                    columns={2}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: compact flat grid, no categories */}
        <div className="md:hidden w-full px-4">
          <div className="grid grid-cols-3 gap-x-1">
            {REGISTRY.map((item, idx) => (
              <TechModule
                key={item.name}
                item={item}
                index={idx}
                columns={3}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom LogoLoop — pinned to bottom */}
      <div className="relative overflow-hidden h-10 md:h-12 [&_img]:opacity-[0.12]">
        <LogoLoop
          logos={loopLogos}
          speed={50}
          direction="right"
          logoHeight={24}
          gap={56}
          fadeOut
          fadeOutColor="#ffffff"
          ariaLabel="Tech stack technologies"
        />
      </div>
    </section>
  );
}
