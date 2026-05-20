"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowRight } from "lucide-react";

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
    month: "Jan",
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
   Archive Card
   ═══════════════════════════════════════════ */

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function ArchiveCard({
  entry,
  idx,
  onClick,
}: {
  entry: ArchiveEntry;
  idx: number;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: idx * 0.06 }}
      className="aspect-square"
    >
      <div
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative w-full h-full cursor-pointer flex flex-col justify-end overflow-hidden"
        style={{
          boxShadow: hovered
            ? "0 4px 6px -1px rgba(0,0,0,0.02), 0 20px 40px -4px rgba(0,0,0,0.12)"
            : "0 4px 6px -1px rgba(0,0,0,0.02), 0 12px 30px -4px rgba(0,0,0,0.08)",
          border: hovered
            ? `1px solid ${entry.accentColor}60`
            : "1px solid rgba(0,0,0,0.06)",
          transition: "border-color 0.25s ease, box-shadow 0.25s ease",
        }}
      >
        {/* Image or accent placeholder filling the top */}
        {entry.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={entry.image}
            alt={`${entry.project} screenshot`}
            width={400}
            height={400}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: `${entry.accentColor}10` }}
          />
        )}

        {/* Bottom label bar */}
        <div
          className="relative z-10 flex items-end justify-between px-4 py-3"
          style={{
            background: entry.image
              ? "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%)"
              : undefined,
          }}
        >
          <h3
            className="font-mono text-sm font-bold tracking-tight uppercase leading-tight"
            style={{ color: entry.image ? "#fff" : "#000" }}
          >
            {entry.project}
          </h3>
          <ArrowRight
            size={16}
            style={{ color: entry.image ? "#fff" : "#000", opacity: 0.7, flexShrink: 0 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
/* ═══════════════════════════════════════════
   Archive Modal
   ═══════════════════════════════════════════ */

function ArchiveModal({
  entry,
  onClose,
}: {
  entry: ArchiveEntry;
  onClose: () => void;
}) {
  const classificationLabel = entry.month
    ? `${entry.month} · ${entry.classification}`
    : entry.classification;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl bg-white rounded-[18px] overflow-hidden"
        style={{
          boxShadow: "0 4px 6px -1px rgba(0,0,0,0.02), 0 20px 40px -4px rgba(0,0,0,0.12)",
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/[0.06] hover:bg-black/[0.12] transition-colors duration-150 font-mono text-black/50 text-sm"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Image or accent placeholder */}
        {entry.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={entry.image}
            alt={`${entry.project} screenshot`}
            width={800}
            height={224}
            className="w-full h-56 object-cover"
          />
        ) : (
          <div
            className="w-full h-56 flex items-center justify-center"
            style={{ background: `${entry.accentColor}18` }}
          >
            <span
              className="font-mono text-5xl font-bold tracking-tight select-none"
              style={{ color: entry.accentColor }}
            >
              {getInitials(entry.project)}
            </span>
          </div>
        )}

        {/* Modal body */}
        <div className="p-6">
          <h2 className="font-mono text-xl font-bold tracking-tight text-black uppercase mb-1">
            {entry.project}
          </h2>
          <span className="font-mono text-[8px] tracking-[0.2em] text-black/35 uppercase">
            {classificationLabel}
          </span>
          <p className="font-mono text-[11px] leading-[1.8] text-black/50 mt-3 mb-4">
            {entry.description}
          </p>

          {/* Tech badges */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {entry.tech.map((t) => (
              <span
                key={t.name}
                className="font-mono text-[8px] tracking-wider text-black/35 uppercase px-2 py-0.5 border border-black/[0.06]"
              >
                {t.name}
              </span>
            ))}
          </div>

          {/* Links */}
          <div className="flex items-center gap-4">
            {entry.github && (
              <a
                href={entry.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-black/30 hover:text-black/70 transition-colors duration-150"
              >
                <GithubIcon size={13} />
                Source
              </a>
            )}
            {entry.link && (
              <a
                href={entry.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 font-mono text-[9px] tracking-[0.15em] uppercase text-black/30 hover:text-[#FFB800] transition-colors duration-150"
              >
                <ArrowUpRight size={13} />
                Visit
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}


/* ═══════════════════════════════════════════
   Archive Page
   ═══════════════════════════════════════════ */

export default function ArchivePage() {
  const [selectedEntry, setSelectedEntry] = useState<ArchiveEntry | null>(null);
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
                {entries.map((entry, idx) => (
                  <ArchiveCard
                    key={entry.index}
                    entry={entry}
                    idx={idx}
                    onClick={() => setSelectedEntry(entry)}
                  />
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
      <AnimatePresence>
        {selectedEntry && (
          <ArchiveModal
            entry={selectedEntry}
            onClose={() => setSelectedEntry(null)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
