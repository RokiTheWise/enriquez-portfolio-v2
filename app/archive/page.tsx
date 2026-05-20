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
  month?: string;           // e.g. "Jan", "Mar"
  image?: string;           // path or URL to screenshot/thumbnail
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
    classification: "CIVIC TECH",
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
    classification: "DIGITAL LOGIC CORE",
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
    classification: "PROFESSIONAL WORK",
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
    classification: "PERSONAL IDENTITY",
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
   Group by Year Helper
   ═══════════════════════════════════════════ */

function groupByYear(entries: ArchiveEntry[]): { year: string; entries: ArchiveEntry[] }[] {
  const map = new Map<string, ArchiveEntry[]>();
  for (const entry of entries) {
    if (!map.has(entry.year)) map.set(entry.year, []);
    map.get(entry.year)!.push(entry);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, entries]) => ({ year, entries }));
}

/* ═══════════════════════════════════════════
   Year Group Header
   ═══════════════════════════════════════════ */

function YearGroupHeader({ year, count, groupIdx }: { year: string; count: number; groupIdx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: groupIdx * 0.1 }}
      className="flex items-baseline gap-4 pt-12 pb-4 first:pt-0"
    >
      <h2
        className="font-mono text-4xl md:text-6xl font-bold tracking-tighter uppercase leading-[0.95] flex-shrink-0"
        style={{ color: "#FFB800" }}
      >
        {year}
      </h2>
      <div className="flex-1 h-[1px] bg-black/[0.06]" />
      <span className="font-mono text-[8px] tracking-[0.3em] text-black/20 uppercase flex-shrink-0">
        {count} {count === 1 ? "Project" : "Projects"}
      </span>
    </motion.div>
  );
}

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
  const classificationLabel = entry.month
    ? `${entry.month} · ${entry.classification}`
    : entry.classification;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: idx * 0.06 }}
      className="group relative"
    >
      {/* Accent bar — always visible, not just on hover */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{ background: entry.accentColor }}
      />

      <div className="flex items-start gap-4 py-6 pl-5 pr-4 md:pr-6 hover:bg-black/[0.015] transition-colors duration-200">
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
                  <span className="font-mono text-[8px] tracking-[0.2em] text-black/35 uppercase">
                    {classificationLabel}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <p className="font-mono text-[10px] md:text-[11px] leading-[1.7] text-black/35 max-w-lg flex-1">
                  {entry.description}
                </p>

                {/* Thumbnail — desktop only, right of description */}
                {entry.image && (
                  <div className="hidden md:block flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={entry.image}
                      alt={`${entry.project} screenshot`}
                      width={96}
                      height={64}
                      className="w-24 h-16 object-cover rounded-sm"
                    />
                  </div>
                )}
              </div>

              {/* Mobile: classification + thumbnail stacked */}
              <div className="md:hidden mt-2 flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1" style={{ background: `${entry.accentColor}60` }} />
                  <span className="font-mono text-[8px] tracking-[0.2em] text-black/35 uppercase">
                    {classificationLabel}
                  </span>
                </div>
                {entry.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={entry.image}
                    alt={`${entry.project} screenshot`}
                    width={80}
                    height={56}
                    className="w-20 h-14 object-cover rounded-sm flex-shrink-0"
                  />
                )}
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
      <header className="fixed top-0 left-0 right-0 z-[1000] bg-white/95 backdrop-blur-sm">
        <div className="flex items-center justify-between p-[2em]">
          {/* Logo + Name — pixel-matched to StaggeredMenu header */}
          <Link href="/" className="flex items-center gap-2 md:gap-3 select-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/DexDev-Logo-96.png"
              alt="Logo"
              className="block h-7 md:h-8 w-auto object-contain"
              draggable={false}
              width={32}
              height={32}
            />
            <span className="font-mono text-[11px] md:text-sm font-semibold tracking-tight text-black uppercase">
              Dexter Jethro Enriquez
            </span>
          </Link>

          {/* Return — same style as MENU + button, minus the vertical bar */}
          <Link
            href="/#projects"
            className="inline-flex items-center gap-[0.3rem] font-mono font-medium leading-none tracking-[0.12em] uppercase text-xs text-black hover:opacity-60 transition-opacity duration-200"
          >
            <span>Return</span>
            <span className="relative w-[14px] h-[14px] shrink-0 inline-flex items-center justify-center">
              <span className="absolute left-1/2 top-1/2 w-full h-[2px] bg-current rounded-[2px] -translate-x-1/2 -translate-y-1/2" />
            </span>
          </Link>
        </div>
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

        {/* ── Timeline groups ── */}
        <div>
          {groupByYear(ARCHIVE).map(({ year, entries }, groupIdx) => (
            <div key={year}>
              <YearGroupHeader year={year} count={entries.length} groupIdx={groupIdx} />
              <div>
                {entries.map((entry, idx) => (
                  <ArchiveRow key={entry.index} entry={entry} idx={idx} />
                ))}
              </div>
            </div>
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
