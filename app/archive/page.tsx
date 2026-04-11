"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

function GithubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

/* ═══════════════════════════════════════════
   Archive Database
   ═══════════════════════════════════════════ */

interface ArchiveEntry {
  year: string;
  project: string;
  index: string;
  classification: string;
  description: string;
  tech: { name: string; tag: string }[];
  link?: string;
  github?: string;
  accentColor: string;
}

const ARCHIVE: ArchiveEntry[] = [
  {
    year: "2026",
    index: "01",
    project: "Aklatang Galera",
    classification: "CIVIC_TECH",
    description: "A community knowledge portal and digital library system for local government units. Full-text search, role-based access, and offline-first sync.",
    tech: [
      { name: "Next.js", tag: "FRAMEWORK" },
      { name: "TypeScript", tag: "CORE" },
      { name: "Tailwind", tag: "STYLING" },
    ],
    link: "https://aklatang-galera.djenriquez.dev/",
    github: "https://github.com/RokiTheWise/aklatang-galera",
    accentColor: "#CCFF00",
  },
  {
    year: "2026",
    index: "02",
    project: "LogiSketch",
    classification: "DIGITAL_LOGIC_CORE",
    description: "A digital logic circuit designer and Boolean synthesis tool. Gate-level schematics on Canvas API with real-time truth-table generation.",
    tech: [
      { name: "Next.js", tag: "FRAMEWORK" },
      { name: "TypeScript", tag: "CORE" },
      { name: "Tailwind", tag: "STYLING" },
    ],
    link: "https://logisketch.djenriquez.dev/",
    github: "https://github.com/RokiTheWise/CircuitBuilder",
    accentColor: "#00D4FF",
  },
  {
    year: "2026",
    index: "03",
    project: "Ace & Co. Accounting",
    classification: "PROFESSIONAL_WORK",
    description: "A full-service accounting platform with integrated client portals, automated scheduling, and real-time financial reporting.",
    tech: [
      { name: "Next.js", tag: "FRAMEWORK" },
      { name: "TypeScript", tag: "CORE" },
      { name: "Tailwind", tag: "STYLING" },
    ],
    link: "https://www.aceandco.org",
    accentColor: "#FFB800",
  },
  {
    year: "2026",
    index: "04",
    project: "Portfolio V1",
    classification: "PERSONAL_IDENTITY",
    description: "First-generation portfolio system with GSAP-driven scroll animations, page transitions, and dynamic theming.",
    tech: [
      { name: "Next.js", tag: "FRAMEWORK" },
      { name: "TypeScript", tag: "CORE" },
      { name: "GSAP", tag: "ANIMATION" },
      { name: "Tailwind", tag: "STYLING" },
    ],
    github: "https://github.com/RokiTheWise/en-portfolio-website.git",
    accentColor: "#FF6B6B",
  },
  {
    year: "2026",
    index: "05",
    project: "Majority Voter Circuit",
    classification: "ELECTRONICS",
    description: "A 3-input majority voter using combinational logic gates. Simulated and validated in Tinkercad.",
    tech: [
      { name: "Tinkercad", tag: "PLATFORM" },
      { name: "Digital Logic", tag: "DOMAIN" },
      { name: "Combinational Circuits", tag: "THEORY" },
    ],
    link: "https://www.tinkercad.com/things/55OzGJMnEK3-3-input-majority-voter",
    accentColor: "#A78BFA",
  },
  {
    year: "2024",
    index: "06",
    project: "Project Wurdle",
    classification: "CS_FUNDAMENTALS",
    description: "A terminal-based word guessing game built as a CS fundamentals exercise. Pattern matching and algorithmic letter validation.",
    tech: [
      { name: "Python", tag: "CORE" },
      { name: "Algorithms", tag: "DOMAIN" },
    ],
    github: "https://github.com/RokiTheWise/Project-Wurdle.git",
    accentColor: "#34D399",
  },
];

/* ═══════════════════════════════════════════
   Corner Brackets
   ═══════════════════════════════════════════ */

function ViewportBrackets({ color }: { color: string }) {
  const arm = 20;
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
   Archive Row
   ═══════════════════════════════════════════ */

function ArchiveRow({ entry, idx }: { entry: ArchiveEntry; idx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: idx * 0.08 }}
      className="group relative"
    >
      {/* 1px accent bar on left */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: entry.accentColor }}
      />

      <div className="flex items-start gap-4 md:gap-0 py-6 px-4 md:px-6 hover:bg-black/[0.015] transition-colors duration-200">
        {/* Index + Year */}
        <div className="w-16 md:w-24 flex-shrink-0 flex flex-col gap-1">
          <span
            className="font-mono text-[10px] font-bold tracking-[0.2em] uppercase"
            style={{ color: entry.accentColor }}
          >
            {entry.index}
          </span>
          <span className="font-mono text-[10px] text-black/20">
            {entry.year}
          </span>
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 md:gap-8">
            {/* Title + Classification + Description */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-mono text-sm md:text-base font-bold tracking-tight text-black uppercase group-hover:text-[#FFB800] transition-colors duration-300 truncate">
                  {entry.project}
                </h3>
                <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                  <div className="w-1 h-1" style={{ background: `${entry.accentColor}60` }} />
                  <span className="font-mono text-[8px] tracking-[0.2em] text-black/20 uppercase">
                    [ {entry.classification} ]
                  </span>
                </div>
              </div>

              <p className="font-mono text-[10px] md:text-[11px] leading-[1.7] text-black/35 max-w-lg">
                {entry.description}
              </p>

              {/* Mobile classification */}
              <div className="md:hidden mt-2 flex items-center gap-2">
                <div className="w-1 h-1" style={{ background: `${entry.accentColor}60` }} />
                <span className="font-mono text-[8px] tracking-[0.2em] text-black/20 uppercase">
                  {entry.classification}
                </span>
              </div>
            </div>

            {/* Tech + Links — right side */}
            <div className="flex flex-col items-start md:items-end gap-3 flex-shrink-0">
              {/* Tech tags */}
              <div className="flex flex-wrap gap-1.5 md:justify-end">
                {entry.tech.map((t) => (
                  <span
                    key={t.name}
                    className="font-mono text-[8px] md:text-[9px] tracking-wider text-black/35 uppercase px-2 py-0.5 border border-black/[0.06]"
                  >
                    {t.name}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex items-center gap-3">
                {entry.github && (
                  <a
                    href={entry.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[9px] tracking-[0.15em] uppercase text-black/20 hover:text-black/60 transition-colors duration-200 flex items-center gap-1.5"
                  >
                    <GithubIcon size={12} />
                    <span className="hidden md:inline">Source</span>
                  </a>
                )}
                {entry.github && entry.link && (
                  <span className="w-[1px] h-3 bg-black/[0.08]" />
                )}
                {entry.link && (
                  <a
                    href={entry.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[9px] tracking-[0.15em] uppercase text-black/20 hover:text-[#FFB800] transition-colors duration-200 flex items-center gap-1.5"
                  >
                    <ArrowUpRight size={12} />
                    <span className="hidden md:inline">Deploy</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom separator */}
      <div className="h-[1px] bg-black/[0.04]" />
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   Archive Page
   ═══════════════════════════════════════════ */

export default function ArchivePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* ── Fixed top nav bar ── */}
      <header className="fixed top-0 left-0 right-0 z-[1000] bg-white/95 backdrop-blur-sm border-b border-black/[0.08]">
        <nav className="flex items-center justify-between px-6 md:px-12 h-12">
          <Link
            href="/"
            className="font-mono text-[11px] md:text-sm font-semibold tracking-tight text-black uppercase"
          >
            Dexter Jethro Enriquez
          </Link>
          <Link
            href="/#projects"
            className="group font-mono text-[11px] tracking-[0.12em] text-black/50 uppercase hover:text-black transition-colors duration-200 flex items-center gap-2"
          >
            <span className="inline-block transition-transform duration-300 group-hover:-translate-x-1">
              &larr;
            </span>
            Return to Base
          </Link>
        </nav>
      </header>

      <div className="max-w-5xl mx-auto px-6 md:px-12 pt-32 pb-24">
        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-2 h-[1px] bg-[#FFB800]" />
            <span className="font-mono text-[9px] tracking-[0.3em] text-[#FFB800]/60 uppercase">
              Full Database
            </span>
          </div>

          <h1 className="font-mono text-4xl md:text-6xl font-bold tracking-tighter text-black uppercase leading-[0.95]">
            Project <span style={{ color: "#FFB800" }}>Archive</span>
          </h1>

          <p className="mt-4 font-mono text-[11px] md:text-xs leading-[1.8] text-black/40 max-w-lg">
            A complete log of deployed systems, experiments, and academic
            coursework.
          </p>
        </motion.div>

        {/* ── Column labels ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex items-center gap-4 md:gap-0 px-4 md:px-6 pb-3 border-b border-black/[0.08]"
        >
          <div className="w-16 md:w-24 flex-shrink-0">
            <span className="font-mono text-[7px] md:text-[8px] tracking-[0.3em] text-black/15 uppercase">
              ID / Year
            </span>
          </div>
          <div className="flex-1">
            <span className="font-mono text-[7px] md:text-[8px] tracking-[0.3em] text-black/15 uppercase">
              Project // Details
            </span>
          </div>
        </motion.div>

        {/* ── Archive entries ── */}
        <div>
          {ARCHIVE.map((entry, idx) => (
            <ArchiveRow key={entry.index} entry={entry} idx={idx} />
          ))}
        </div>

        {/* ── Footer diagnostic ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-16 relative"
        >
          <div className="w-full h-[1px] bg-black/[0.06] mb-8" />

          <div className="relative inline-block p-6 pr-12">
            <ViewportBrackets color="rgba(0,0,0,0.08)" />

            <div className="flex flex-col gap-2">
              <span className="font-mono text-[8px] tracking-[0.3em] text-black/15 uppercase">
                Archive Status
              </span>
              <div className="flex flex-wrap items-center gap-4 md:gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-[#FFB800]" />
                  <span className="font-mono text-[10px] tracking-wider text-black/30 uppercase">
                    {ARCHIVE.length} Entries
                  </span>
                </div>
                <span className="w-[1px] h-3 bg-black/[0.08]" />
                <span className="font-mono text-[10px] tracking-wider text-black/20 uppercase">
                  {new Set(ARCHIVE.map((e) => e.year)).size} Active Years
                </span>
                <span className="w-[1px] h-3 bg-black/[0.08]" />
                <span className="font-mono text-[10px] tracking-wider text-black/20 uppercase">
                  {new Set(ARCHIVE.flatMap((e) => e.tech.map((t) => t.name))).size} Technologies
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
