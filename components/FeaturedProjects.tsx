"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { usePrefersReducedMotion } from "@/lib/motion";
import { usePageTransition } from "@/components/PageTransition";
import { ARCHIVE } from "@/components/archive/data";

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

/* Vertical scroll runway per slide, in vh. Below 100 the horizontal travel
   still covers every slide, it just costs less scrolling to get through. */
const SLIDE_VH = 70;

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
    classification: "CIVIC TECH",
    description:
      "A bilingual civic portal centralizing 100+ educational, livelihood, and government resources for Puerto Galera. Features Semantic Scholar\u2013powered research, 34+ scholarly databases, and a curated public services hub. Lighthouse 100 on desktop, 98 mobile.",
    heroImage: "/aklatang-galera.webp",
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
    classification: "DIGITAL LOGIC SYNTHESIS",
    description:
      "A reactive Boolean logic synthesis tool featuring a recursive descent parser, Quine\u2013McCluskey minimization for optimal SOP reduction, and a custom schematic routing engine generating NAND/NOR circuits with vertical bus alignment.",
    heroImage: "/logisketch.webp",
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
    classification: "CORPORATE WEB",
    description:
      "Official corporate website for Ang Chua Enriquez & Company, a professional accounting and auditing firm in Manila. Achieves perfect 100 Lighthouse scores in Performance, SEO, and Best Practices with dynamic sitemap, Open Graph, and fluid Framer Motion animations.",
    heroImage: "/ace-and-co.webp",
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

function ProjectSlide({
  project,
  stacked = false,
}: {
  project: Project;
  stacked?: boolean;
}) {
  return (
    <div
      className={`relative flex items-start md:items-center justify-center pt-40 md:pt-52 pb-8 md:pb-20 ${
        stacked
          ? "w-full min-h-screen"
          : "w-screen h-screen flex-shrink-0"
      }`}
    >
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
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-4 md:gap-14 max-w-6xl w-full px-8 md:px-16">
        {/* Technical Viewport (image) */}
        <div className="relative w-full md:w-[55%] aspect-[16/8] md:aspect-[16/10] flex-shrink-0">
          <ViewportBrackets color={project.accentColor} />

          <div className="absolute inset-[8px] overflow-hidden bg-[#F5F5F5]">
            <Image
              src={project.heroImage}
              alt={project.title}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 55vw"
            />
            <div
              className="absolute bottom-0 left-0 right-0 h-[2px]"
              style={{ background: project.accentColor }}
            />
          </div>
        </div>

        {/* Diagnostic Data Card */}
        <div className="w-full md:w-[45%] flex flex-col gap-2 md:gap-5">
          {/* Classification */}
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5" style={{ background: project.accentColor }} />
            <span className="font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-black/65 uppercase">
              {project.classification}
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
            <h3 className="font-mono text-2xl md:text-4xl font-bold tracking-display-sm md:tracking-display-md text-black uppercase leading-[0.95]">
              {project.title}
            </h3>
          </div>

          {/* 1px separator */}
          <div className="w-full h-[1px] bg-black/[0.06]" />

          {/* Technical description */}
          <p className="font-mono text-[11px] md:text-xs leading-[1.8] text-black/60 max-w-md">
            {project.description}
          </p>

          {/* Tech Stack */}
          <div className="flex flex-col gap-2 mt-0 md:mt-1">
            <span className="font-mono text-[8px] tracking-[0.3em] text-black/62 uppercase">
              Tech Stack
            </span>
            <div className="flex flex-wrap gap-0">
              {project.registry.map((r, i) => (
                <div
                  key={r.name}
                  className={`group flex items-center gap-3 px-4 py-1.5 md:py-2.5 border-b border-black/[0.06] cursor-default ${
                    i < 2 ? "border-r border-r-black/[0.06]" : ""
                  }`}
                >
                  <span className="font-mono text-xs md:text-sm font-bold tracking-wider text-black/80 uppercase group-hover:text-[#FFB800] transition-colors duration-300">
                    {r.name}
                  </span>
                  <span className="font-mono text-[8px] md:text-[9px] tracking-[0.2em] text-black/60 uppercase">
                    {r.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-1 md:mt-2 flex items-center gap-3">
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn inline-flex items-center gap-2 font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase font-semibold border border-black bg-black text-white px-5 py-2.5 no-underline transition-[background-color,color,transform] duration-200 hover:bg-transparent hover:text-black active:scale-[0.97] active:duration-[120ms]"
            >
              <span>View Deployment</span>
              <span className="inline-block transition-transform duration-300 group-hover/btn:translate-x-1">&rarr;</span>
            </a>
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group/src inline-flex items-center gap-2 font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase font-semibold border border-black text-black px-5 py-2.5 no-underline transition-[background-color,color,transform] duration-200 hover:bg-black hover:text-white active:scale-[0.97] active:duration-[120ms]"
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
  const { navigate } = usePageTransition();
  const reducedMotion = usePrefersReducedMotion();

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

        Runway is deliberately shorter than SLIDE_COUNT * 100vh. Tying it 1:1
        to the slide count meant a full screen-height of scrolling per slide,
        which made the section feel far longer than its content justified (the
        4th panel is a single CTA button). SLIDE_VH = 70 keeps the same
        horizontal travel over ~30% less vertical scrolling.

        Reduced motion: no sideways travel driven by vertical scroll. The
        wrapper collapses to auto height and the slides stack in normal flow,
        so the same content is reachable by plain scrolling.
      */}
      <div
        ref={wrapperRef}
        className="relative bg-white"
        style={
          reducedMotion
            ? undefined
            : { height: `${SLIDE_COUNT * SLIDE_VH}vh` }
        }
      >
        {/* Sticky container — locks to viewport while wrapper scrolls */}
        <div
          className={
            reducedMotion
              ? "relative"
              : "sticky top-0 h-screen overflow-hidden"
          }
        >
          {/* HUD Overlay: Section header */}
          <div
            className={`${
              reducedMotion ? "sticky" : "absolute"
            } top-24 left-6 md:left-12 z-30 pointer-events-none`}
          >
            <h2 className="font-mono text-3xl md:text-5xl font-bold tracking-display-md md:tracking-display-lg text-black uppercase">
              Featured Projects
            </h2>
            <div className="mt-2 font-mono text-[9px] md:text-[10px] tracking-[0.3em] text-black/60 uppercase">
              Deployment Archive • Selected Work
            </div>

          </div>

          {/* HUD Overlay: Progress pips — describe horizontal travel, so they
              are meaningless once the slides stack vertically. */}
          <div
            className={`absolute bottom-8 md:bottom-12 left-6 md:left-12 z-30 pointer-events-none ${
              reducedMotion ? "hidden" : ""
            }`}
          >
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
          <div
            className={`absolute bottom-8 md:bottom-12 right-6 md:right-12 z-30 pointer-events-none ${
              reducedMotion ? "hidden" : ""
            }`}
          >
            <span className="font-mono text-[8px] tracking-[0.25em] text-black/55 uppercase flex items-center gap-2">
              Scroll &rarr;
            </span>

          </div>

          {/* Horizontal track — translated by scroll progress */}
          <motion.div
            className={
              reducedMotion
                ? "flex flex-col"
                : "flex h-full will-change-transform"
            }
            style={reducedMotion ? undefined : { x }}
          >
            {PROJECTS.map((project) => (
              <ProjectSlide
                key={project.title}
                project={project}
                stacked={reducedMotion}
              />
            ))}

            {/* 4th panel — View All Projects CTA */}
            <div
              className={`relative flex items-center justify-center pt-40 md:pt-52 pb-8 md:pb-20 ${
                reducedMotion
                  ? "w-full min-h-screen"
                  : "w-screen h-screen flex-shrink-0"
              }`}
            >
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

                <h3 className="font-mono text-3xl md:text-5xl font-bold tracking-display-md md:tracking-display-lg text-black uppercase leading-[0.95]">
                  Project Archive
                </h3>

                <p className="font-mono text-[11px] md:text-xs leading-[1.8] text-black/55 max-w-sm">
                  A complete log of deployed systems, experiments, and academic coursework.
                </p>

                <button
                  onClick={() => navigate("/archive")}
                  className="group inline-flex items-center gap-3 font-mono text-xs md:text-sm tracking-[0.15em] uppercase font-semibold border border-black bg-black text-white px-8 py-4 mt-4 transition-[background-color,color,transform] duration-200 hover:bg-transparent hover:text-black active:scale-[0.97] active:duration-[120ms] cursor-pointer"
                >
                  <span>View All Projects</span>
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    &rarr;
                  </span>
                </button>

                <span className="font-mono text-[8px] tracking-[0.25em] text-black/58 uppercase mt-4">
                  {PROJECTS.length} featured • {ARCHIVE.length} total entries
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
