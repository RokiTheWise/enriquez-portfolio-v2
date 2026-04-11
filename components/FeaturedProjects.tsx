"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

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
   Project Card
   ═══════════════════════════════════════════ */

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="relative py-20 md:py-28"
    >
      {/* Large background index */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span
          className="font-mono font-bold leading-none"
          style={{
            fontSize: "clamp(200px, 40vh, 500px)",
            WebkitTextStroke: "1px rgba(0,0,0,0.03)",
            color: "transparent",
          }}
        >
          {project.index}
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 md:gap-16 max-w-6xl mx-auto">
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

          {/* Tech Registry — matches Techstack monochromatic style */}
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

      {/* Bottom rule between projects */}
      <div className="max-w-6xl mx-auto mt-20 md:mt-28 h-[1px] bg-black/[0.04]" />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   FeaturedProjects — Vertical Scroll
   ═══════════════════════════════════════════ */

export default function FeaturedProjects() {
  const headingRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-80px" });

  return (
    <section id="projects" className="relative w-full bg-white px-6 md:px-12 py-24 md:py-32">
      {/* Section header */}
      <motion.div
        ref={headingRef}
        initial={{ opacity: 0, y: 20 }}
        animate={headingInView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="mb-4 md:mb-8 max-w-6xl mx-auto"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-2 h-[1px] bg-[#FFB800]" />
          <span className="font-mono text-[9px] tracking-[0.3em] text-[#FFB800]/60 uppercase">
            Section 03
          </span>
        </div>
        <h2 className="font-mono text-4xl md:text-6xl font-bold tracking-tighter text-black uppercase">
          Featured Projects
        </h2>
        <div className="mt-2 font-mono text-[10px] md:text-xs tracking-[0.3em] text-black/25 uppercase">
          Deployment Archive // Selected Work
        </div>
      </motion.div>

      {/* Project cards — stacked vertically */}
      {PROJECTS.map((project, i) => (
        <ProjectCard key={project.title} project={project} index={i} />
      ))}
    </section>
  );
}
