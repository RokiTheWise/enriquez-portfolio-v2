"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ── Project Data ── */

interface Project {
  title: string;
  subtitle: string;
  description: string;
  heroImage: string;
  stack: { name: string; tag: string }[];
  color: string;
}

const PROJECTS: Project[] = [
  {
    title: "Aklatang Galera",
    subtitle: "Civic Tech Platform",
    description:
      "A community-driven digital library and archival system built for local government units. Implements full-text search, role-based access, and offline-first sync for remote barangay libraries.",
    heroImage: "/projects/aklatang-galera.png",
    stack: [
      { name: "Next.js", tag: "FRAMEWORK" },
      { name: "TypeScript", tag: "CORE" },
      { name: "Supabase", tag: "DATABASE" },
      { name: "Tailwind", tag: "STYLING" },
    ],
    color: "#FFB800",
  },
  {
    title: "LogiSketch",
    subtitle: "Developer Tool",
    description:
      "A real-time collaborative whiteboard for sketching logic diagrams, system architectures, and flowcharts. Features gesture recognition that converts rough strokes into clean shapes and connectors.",
    heroImage: "/projects/logisketch.png",
    stack: [
      { name: "React", tag: "FRAMEWORK" },
      { name: "TypeScript", tag: "CORE" },
      { name: "Node.js", tag: "RUNTIME" },
      { name: "Vite", tag: "BUILD" },
    ],
    color: "#00D4FF",
  },
  {
    title: "Portfolio V2",
    subtitle: "Creative Development",
    description:
      "This portfolio — a WebGL-driven personal site with brush-stroke reveal masks, particle systems, GSAP-powered scroll choreography, and a HUD-style navigation layer.",
    heroImage: "/projects/portfolio-v2.png",
    stack: [
      { name: "Next.js", tag: "FRAMEWORK" },
      { name: "Three.js", tag: "3D" },
      { name: "GSAP", tag: "ANIMATION" },
      { name: "Tailwind", tag: "STYLING" },
    ],
    color: "#CCFF00",
  },
];

/* ── Project Slide ── */

function ProjectSlide({ project, index }: { project: Project; index: number }) {
  return (
    <div
      className="project-slide flex-shrink-0 w-screen h-full flex items-center justify-center px-6 md:px-16"
    >
      <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16 max-w-6xl w-full">
        {/* Hero Image */}
        <div className="relative w-full md:w-[55%] aspect-[16/10] rounded-xl overflow-hidden border border-white/10 bg-black/[0.03] group">
          {/* Placeholder gradient when no image exists */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, ${project.color}08 0%, ${project.color}15 50%, ${project.color}05 100%)`,
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <span
              className="font-mono text-5xl md:text-7xl font-bold tracking-tighter opacity-[0.08] uppercase"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="font-mono text-[10px] tracking-[0.3em] text-black/20 uppercase">
              [ Hero Image ]
            </span>
          </div>
          {/* Accent bar */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[2px]"
            style={{ background: project.color }}
          />
        </div>

        {/* Info Panel */}
        <div className="w-full md:w-[45%] flex flex-col gap-5 md:gap-6">
          {/* Index + Subtitle */}
          <div className="flex items-center gap-3">
            <span
              className="font-mono text-[10px] md:text-xs tracking-[0.3em] font-bold uppercase"
              style={{ color: project.color }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="w-4 h-[1px] bg-black/10" />
            <span className="font-mono text-[10px] md:text-xs tracking-[0.2em] text-black/30 uppercase">
              {project.subtitle}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-mono text-3xl md:text-5xl font-bold tracking-tighter text-black uppercase leading-[0.95]">
            {project.title}
          </h3>

          {/* Description */}
          <p className="font-mono text-xs md:text-sm leading-relaxed text-black/50 max-w-md">
            {project.description}
          </p>

          {/* Stack Tags — registry style */}
          <div className="flex flex-wrap gap-2 mt-1">
            {project.stack.map((s) => (
              <div
                key={s.name}
                className="flex items-center gap-2 px-3 py-1.5 border border-black/[0.06] rounded-md bg-black/[0.015] hover:border-[#FFB800] transition-colors duration-200"
              >
                <span className="font-mono text-[10px] md:text-xs font-bold tracking-wider text-black/70 uppercase">
                  {s.name}
                </span>
                <span className="font-mono text-[7px] md:text-[8px] tracking-[0.2em] text-black/20 uppercase">
                  [ {s.tag} ]
                </span>
              </div>
            ))}
          </div>

          {/* View Project CTA */}
          <div className="mt-2">
            <button className="group/btn font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase text-black/40 hover:text-[#FFB800] transition-colors duration-300 flex items-center gap-2">
              <span>View Project</span>
              <span className="inline-block transition-transform duration-300 group-hover/btn:translate-x-1">
                &rarr;
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Main Section ── */

export default function FeaturedProjects() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      // Total horizontal scroll distance = track width minus one viewport
      const getScrollDistance = () => track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: () => -getScrollDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getScrollDistance()}`,
          pin: true,
          scrub: 0.8,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="relative w-full bg-white overflow-hidden"
    >
      {/* Heading overlay — fixed during pin */}
      <div
        ref={headingRef}
        className="absolute top-8 md:top-12 left-6 md:left-12 z-20 pointer-events-none"
      >
        <h2 className="font-mono text-4xl md:text-6xl font-bold tracking-tighter text-black uppercase">
          Featured Projects
        </h2>
        <div className="mt-2 font-mono text-[10px] md:text-xs tracking-[0.3em] text-black/25 uppercase">
          Selected Work
        </div>
      </div>

      {/* Progress indicator */}
      <div className="absolute bottom-8 md:bottom-12 left-6 md:left-12 z-20 pointer-events-none">
        <div className="flex items-center gap-3">
          {PROJECTS.map((p, i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className="font-mono text-[9px] tracking-[0.2em] text-black/20 uppercase"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div
                className="w-8 md:w-12 h-[1px]"
                style={{ background: `${p.color}30` }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Scroll direction hint */}
      <div className="absolute bottom-8 md:bottom-12 right-6 md:right-12 z-20 pointer-events-none">
        <span className="font-mono text-[9px] tracking-[0.2em] text-black/15 uppercase flex items-center gap-2">
          Scroll
          <span className="inline-block animate-pulse">&rarr;</span>
        </span>
      </div>

      {/* Horizontal track */}
      <div
        ref={trackRef}
        className="flex h-screen items-center will-change-transform"
      >
        {/* Spacer so first slide clears the heading */}
        <div className="flex-shrink-0 w-[10vw] md:w-[5vw]" />

        {PROJECTS.map((project, i) => (
          <ProjectSlide key={project.title} project={project} index={i} />
        ))}

        {/* End spacer */}
        <div className="flex-shrink-0 w-[15vw] md:w-[10vw]" />
      </div>
    </section>
  );
}
