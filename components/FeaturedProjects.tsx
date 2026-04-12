"use client";

import { useRef } from "react";
import Image from "next/image";
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

const SLIDE_COUNT = 4; // 3 projects + 1 "View All" CTA panel

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
  liveUrl: string;
  githubUrl?: string;
}

const PROJECTS: Project[] = [
  {
    index: "01",
    title: "Aklatang Galera",
    classification: "CIVIC_TECH",
    description:
      "A bilingual civic portal centralizing 100+ educational, livelihood, and government resources for Puerto Galera. Features Semantic Scholar\u2013powered research, 34+ scholarly databases, and a curated public services hub. Lighthouse 100 on desktop, 98 mobile.",
    heroImage: "/Aklatang-Galera.png",
    registry: [
      { name: "Next.js", tag: "FRAMEWORK" },
      { name: "React", tag: "UI" },
      { name: "TypeScript", tag: "CORE" },
      { name: "Tailwind", tag: "STYLING" },
    ],
    accentColor: "#CCFF00",
    liveUrl: "https://aklatang-galera.djenriquez.dev",
    githubUrl: "https://github.com/RokiTheWise/aklatang-galera",
  },
  {
    index: "02",
    title: "LogiSketch",
    classification: "DIGITAL_LOGIC_SYNTHESIS",
    description:
      "A reactive Boolean logic synthesis tool featuring a recursive descent parser, Quine\u2013McCluskey minimization for optimal SOP reduction, and a custom schematic routing engine generating NAND/NOR circuits with vertical bus alignment.",
    heroImage: "/LogiSketch.png",
    registry: [
      { name: "Next.js", tag: "FRAMEWORK" },
      { name: "React", tag: "UI" },
      { name: "TypeScript", tag: "CORE" },
      { name: "React Flow", tag: "RENDER" },
    ],
    accentColor: "#00D4FF",
    liveUrl: "https://logisketch.djenriquez.dev",
    githubUrl: "https://github.com/RokiTheWise/CircuitBuilder",
  },
  {
    index: "03",
    title: "ACE & Company",
    classification: "CORPORATE_WEB",
    description:
      "Official corporate website for Ang Chua Enriquez & Company, a professional accounting and auditing firm in Manila. Achieves perfect 100 Lighthouse scores in Performance, SEO, and Best Practices with dynamic sitemap, Open Graph, and fluid Framer Motion animations.",
    heroImage: "/ACE.png",
    registry: [
      { name: "Next.js", tag: "FRAMEWORK" },
      { name: "React", tag: "UI" },
      { name: "Tailwind", tag: "STYLING" },
      { name: "Framer Motion", tag: "ANIMATION" },
    ],
    accentColor: "#FFB800",
    liveUrl: "https://aceandco.org",
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
    <div className="relative w-screen h-screen flex-shrink-0 flex items-center justify-center pt-52 pb-20">
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
            <Image
              src={project.heroImage}
              alt={project.title}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 55vw"
            />
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
          <div className="mt-2 flex items-center gap-3">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn inline-flex items-center gap-2 font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase font-semibold border border-black bg-black text-white px-5 py-2.5 no-underline transition-colors duration-200 hover:bg-transparent hover:text-black"
            >
              <span>View Deployment</span>
              <span className="inline-block transition-transform duration-300 group-hover/btn:translate-x-1">&rarr;</span>
            </a>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/src inline-flex items-center gap-2 font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase font-semibold border border-black text-black px-5 py-2.5 no-underline transition-colors duration-200 hover:bg-black hover:text-white"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="flex-shrink-0"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
                <span>Source Code</span>
              </a>
            )}
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
          <div className="absolute top-24 left-6 md:left-12 z-30 pointer-events-none">
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

            {/* 4th panel — View All Projects CTA */}
            <div className="relative w-screen h-screen flex-shrink-0 flex items-center justify-center pt-52 pb-20">
              {/* Background index */}
              <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                <span
                  className="font-mono font-bold leading-none"
                  style={{
                    fontSize: "40vh",
                    WebkitTextStroke: "1px rgba(0,0,0,0.03)",
                    color: "transparent",
                  }}
                >
                  //
                </span>
              </div>

              <div className="relative z-10 flex flex-col items-center gap-8 text-center px-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-[1px] bg-[#FFB800]/30" />
                  <span className="font-mono text-[9px] tracking-[0.3em] text-[#FFB800]/60 uppercase">
                    Full Database
                  </span>
                  <div className="w-8 h-[1px] bg-[#FFB800]/30" />
                </div>

                <h3 className="font-mono text-3xl md:text-5xl font-bold tracking-tighter text-black uppercase leading-[0.95]">
                  Project Archive
                </h3>

                <p className="font-mono text-[11px] md:text-xs leading-[1.8] text-black/40 max-w-sm">
                  A complete log of deployed systems, experiments, and academic coursework.
                </p>

                <a
                  href="/archive"
                  className="group inline-flex items-center gap-3 font-mono text-xs md:text-sm tracking-[0.15em] uppercase font-semibold border border-black bg-black text-white px-8 py-4 mt-4 no-underline transition-colors duration-200 hover:bg-transparent hover:text-black"
                >
                  <span>View All Projects</span>
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    &rarr;
                  </span>
                </a>

                <span className="font-mono text-[8px] tracking-[0.25em] text-black/15 uppercase mt-4">
                  {PROJECTS.length} featured // 6 total entries
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
