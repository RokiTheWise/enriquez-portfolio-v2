"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

/*
 * Horizontal scroll approach: CSS sticky + Framer Motion.
 *
 * - A tall outer wrapper provides the vertical scroll runway
 *   (height = SLIDE_COUNT * 100vh).
 * - Inside it, a `sticky top-0` container locks to the viewport.
 * - Framer Motion's useScroll tracks progress through the wrapper (0→1).
 * - useTransform maps that progress to a negative translateX on the track.
 *
 * No GSAP, no pin-spacers, works natively with Lenis.
 */

const SLIDE_COUNT = 3;

/* ═══════════════════════════════════════════
   Project Data
   ═══════════════════════════════════════════ */

interface Project {
  index: string;
  title: string;
  classification: string;
  description: string;
  heroImage: string;
  registry: { name: string; tag: string }[];
  accentColor: string;
}

const PROJECTS: Project[] = [
  {
    index: "01",
    title: "Ace & Co. Accounting",
    classification: "PROFESSIONAL_WORK",
    description:
      "A full-service accounting platform with integrated client portals and automated scheduling. Streamlines document exchange, deadline tracking, and real-time financial reporting for small-to-mid enterprises.",
    heroImage: "/projects/ace-and-co.png",
    registry: [
      { name: "React", tag: "FRAMEWORK" },
      { name: "Django", tag: "BACKEND" },
      { name: "Python", tag: "CORE" },
      { name: "Tailwind", tag: "STYLING" },
    ],
    accentColor: "#FFB800",
  },
  {
    index: "02",
    title: "LogiSketch",
    classification: "DIGITAL_LOGIC_CORE",
    description:
      "A digital logic circuit designer and Boolean logic synthesis tool. Renders gate-level schematics on a Canvas API surface with real-time truth-table generation and expression minimization via Quine\u2013McCluskey.",
    heroImage: "/projects/logisketch.png",
    registry: [
      { name: "React", tag: "FRAMEWORK" },
      { name: "TypeScript", tag: "CORE" },
      { name: "Canvas API", tag: "RENDER" },
      { name: "Vite", tag: "BUILD" },
    ],
    accentColor: "#00D4FF",
  },
  {
    index: "03",
    title: "Aklatang Galera",
    classification: "CIVIC_TECH",
    description:
      "A community knowledge portal and digital library system for local government units. Provides full-text search, role-based document access, and offline-first synchronization for underserved barangay libraries.",
    heroImage: "/projects/aklatang-galera.png",
    registry: [
      { name: "Next.js", tag: "FRAMEWORK" },
      { name: "TypeScript", tag: "CORE" },
      { name: "Supabase", tag: "DATABASE" },
      { name: "Tailwind", tag: "STYLING" },
    ],
    accentColor: "#CCFF00",
  },
];

/* ═══════════════════════════════════════════
   Corner Brackets — 1px viewfinder frame
   ═══════════════════════════════════════════ */

function ViewportBrackets({ color }: { color: string }) {
  const arm = 28;
  return (
    <>
      <svg className="absolute top-0 left-0" width={arm} height={arm}>
        <path d={`M0 ${arm} L0 0 L${arm} 0`} fill="none" stroke={color} strokeWidth="1" />
      </svg>
      <svg className="absolute top-0 right-0" width={arm} height={arm}>
        <path d={`M0 0 L${arm} 0 L${arm} ${arm}`} fill="none" stroke={color} strokeWidth="1" />
      </svg>
      <svg className="absolute bottom-0 left-0" width={arm} height={arm}>
        <path d={`M0 0 L0 ${arm} L${arm} ${arm}`} fill="none" stroke={color} strokeWidth="1" />
      </svg>
      <svg className="absolute bottom-0 right-0" width={arm} height={arm}>
        <path d={`M0 ${arm} L${arm} ${arm} L${arm} 0`} fill="none" stroke={color} strokeWidth="1" />
      </svg>
    </>
  );
}

/* ═══════════════════════════════════════════
   Project Slide (full-viewport panel)
   ═══════════════════════════════════════════ */

function ProjectSlide({ project }: { project: Project }) {
  return (
    <div className="relative w-screen h-screen flex-shrink-0 flex items-center justify-center">
      {/* z-0 : Enormous outlined background index */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span
          className="font-mono font-bold leading-none"
          style={{
            fontSize: "40vh",
            WebkitTextStroke: "1px rgba(0,0,0,0.03)",
            color: "transparent",
          }}
        >
          {project.index}
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-14 max-w-6xl w-full px-8 md:px-16">
        {/* Technical Viewport (image) */}
        <div className="relative w-full md:w-[55%] aspect-[16/10] flex-shrink-0">
          <ViewportBrackets color={project.accentColor} />

          <div className="absolute inset-[8px] border border-black/[0.06] overflow-hidden bg-black/[0.015]">
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${project.accentColor}06 0%, ${project.accentColor}10 50%, ${project.accentColor}04 100%)`,
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <span
                className="font-mono text-6xl md:text-8xl font-bold leading-none"
                style={{
                  WebkitTextStroke: `1px ${project.accentColor}20`,
                  color: "transparent",
                }}
              >
                {project.index}
              </span>
              <span className="font-mono text-[8px] tracking-[0.3em] text-black/15 uppercase">
                [ viewport ]
              </span>
            </div>
            <div
              className="absolute bottom-0 left-0 right-0 h-[1px]"
              style={{ background: project.accentColor }}
            />
          </div>

          <span className="absolute -bottom-6 left-0 font-mono text-[7px] tracking-[0.25em] text-black/15 uppercase">
            fig_{project.index}_preview.render
          </span>
        </div>

        {/* Diagnostic Data Card */}
        <div className="w-full md:w-[45%] flex flex-col gap-4 md:gap-5">
          {/* Classification */}
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5" style={{ background: project.accentColor }} />
            <span className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-black/30 uppercase">
              [ {project.classification} ]
            </span>
          </div>

          {/* Index + Title */}
          <div className="flex flex-col gap-1">
            <span
              className="font-mono text-[10px] tracking-[0.2em] font-bold uppercase"
              style={{ color: project.accentColor }}
            >
              Project {project.index}
            </span>
            <h3 className="font-mono text-2xl md:text-4xl font-bold tracking-tighter text-black uppercase leading-[0.95]">
              {project.title}
            </h3>
          </div>

          {/* 1px separator */}
          <div className="w-full h-[1px] bg-black/[0.06]" />

          {/* Technical description */}
          <p className="font-mono text-[11px] md:text-xs leading-[1.8] text-black/45 max-w-md">
            {project.description}
          </p>

          {/* Tech Registry */}
          <div className="flex flex-col gap-2 mt-1">
            <span className="font-mono text-[8px] tracking-[0.3em] text-black/20 uppercase">
              Tech Registry
            </span>
            <div className="flex flex-wrap gap-0">
              {project.registry.map((r, i) => (
                <div
                  key={r.name}
                  className={`group flex items-center gap-3 px-4 py-2.5 border-b border-black/[0.06] cursor-default ${
                    i < 2 ? "border-r border-r-black/[0.06]" : ""
                  }`}
                >
                  <span className="font-mono text-xs md:text-sm font-bold tracking-wider text-black/80 uppercase group-hover:text-[#FFB800] transition-colors duration-300">
                    {r.name}
                  </span>
                  <span className="font-mono text-[8px] md:text-[9px] tracking-[0.2em] text-black/20 uppercase">
                    [ {r.tag} ]
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-2 flex items-center gap-4">
            <button className="group/btn font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase text-black/30 hover:text-[#FFB800] transition-colors duration-300 flex items-center gap-2">
              <span>View Deployment</span>
              <span className="inline-block transition-transform duration-300 group-hover/btn:translate-x-1">&rarr;</span>
            </button>
            <span className="w-[1px] h-3 bg-black/[0.08]" />
            <button className="group/btn font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase text-black/30 hover:text-[#FFB800] transition-colors duration-300 flex items-center gap-2">
              <span>Source</span>
              <span className="inline-block transition-transform duration-300 group-hover/btn:translate-x-1">&rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   FeaturedProjects — Horizontal Scroll Gallery

   Uses CSS sticky + Framer Motion (no GSAP).
   The tall wrapper provides vertical scroll runway.
   The sticky container locks to the viewport.
   useScroll progress drives the horizontal translateX.
   ═══════════════════════════════════════════ */

export default function FeaturedProjects() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Track vertical scroll progress through the tall wrapper (0 → 1)
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  // Map scroll progress → horizontal translate
  // At progress 0 the track is at x=0 (showing slide 1).
  // At progress 1 the track has shifted left by (SLIDE_COUNT - 1) viewports.
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["0vw", `${-(SLIDE_COUNT - 1) * 100}vw`],
  );

  return (
    <section id="projects">
      {/*
        Tall wrapper — provides the vertical scroll runway.
        height = SLIDE_COUNT * 100vh so each "page" of scroll
        reveals the next horizontal slide.
      */}
      <div
        ref={wrapperRef}
        className="relative bg-white"
        style={{ height: `${SLIDE_COUNT * 100}vh` }}
      >
        {/* Sticky container — locks to viewport while wrapper scrolls */}
        <div className="sticky top-0 h-screen overflow-hidden">
          {/* HUD Overlay: Section header */}
          <div className="absolute top-8 md:top-12 left-6 md:left-12 z-30 pointer-events-none">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-[1px] bg-[#FFB800]" />
              <span className="font-mono text-[9px] tracking-[0.3em] text-[#FFB800]/60 uppercase">
                Section 03
              </span>
            </div>
            <h2 className="font-mono text-3xl md:text-5xl font-bold tracking-tighter text-black uppercase">
              Featured Projects
            </h2>
            <div className="mt-2 font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-black/20 uppercase">
              Deployment Archive // Selected Work
            </div>
          </div>

          {/* HUD Overlay: Progress pips */}
          <div className="absolute bottom-8 md:bottom-12 left-6 md:left-12 z-30 pointer-events-none">
            <div className="flex items-center gap-4">
              {PROJECTS.map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span
                    className="font-mono text-[8px] tracking-[0.2em] uppercase"
                    style={{ color: `${p.accentColor}60` }}
                  >
                    {p.index}
                  </span>
                  <div
                    className="w-8 md:w-12 h-[1px]"
                    style={{ background: `${p.accentColor}30` }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* HUD Overlay: Scroll hint */}
          <div className="absolute bottom-8 md:bottom-12 right-6 md:right-12 z-30 pointer-events-none">
            <span className="font-mono text-[8px] tracking-[0.25em] text-black/[0.12] uppercase flex items-center gap-2">
              Scroll &rarr;
            </span>
          </div>

          {/* Horizontal track — translated by scroll progress */}
          <motion.div
            className="flex h-full will-change-transform"
            style={{ x }}
          >
            {PROJECTS.map((project) => (
              <ProjectSlide key={project.title} project={project} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
