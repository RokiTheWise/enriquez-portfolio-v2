"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ContactParticles from "@/components/contact/ContactParticles";
import { usePageTransition } from "@/components/PageTransition";
import { EASE } from "@/lib/motion";
import { ARCHIVE, groupByYear } from "@/components/archive/data";
import LedgerRow, { LEDGER_GRID } from "@/components/archive/LedgerRow";
import ViewportBrackets from "@/components/archive/ViewportBrackets";

/* ═══════════════════════════════════════════
   Year Group Header
   ═══════════════════════════════════════════ */

function YearGroupHeader({ year, count, groupIdx }: { year: string; count: number; groupIdx: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: groupIdx === 0 ? 0.1 : 0, ease: EASE }}
      className="flex items-baseline gap-4 pt-14 pb-4 first:pt-0"
    >
      <h2
        className="font-mono text-4xl md:text-6xl font-bold tracking-tighter uppercase leading-[0.95] flex-shrink-0"
        style={{ color: "#FFB800" }}
      >
        {year}
      </h2>
      <div className="flex-1 h-[1px] bg-black/[0.06]" />
      <span className="font-mono text-[8px] tracking-[0.3em] text-black/20 uppercase flex-shrink-0">
        {count} {count === 1 ? "Entry" : "Entries"}
      </span>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════
   Archive Page — Deployment Ledger
   ═══════════════════════════════════════════ */

export default function ArchivePage() {
  const { navigate } = usePageTransition();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Year groups with the running global index offset of each group.
  const groups = useMemo(() => {
    const grouped = groupByYear(ARCHIVE);
    let offset = 0;
    return grouped.map((g) => {
      const withOffset = { ...g, startIndex: offset };
      offset += g.entries.length;
      return withOffset;
    });
  }, []);

  const stats = useMemo(
    () => ({
      entries: ARCHIVE.length,
      years: new Set(ARCHIVE.map((e) => e.year)).size,
      technologies: new Set(ARCHIVE.flatMap((e) => e.tech.map((t) => t.name))).size,
    }),
    [],
  );

  return (
    <main className="relative min-h-screen bg-white overflow-hidden">
      <ContactParticles />

      {/* ── Fixed top nav bar ── */}
      <header className="fixed top-0 left-0 right-0 z-[1000] bg-white/95 backdrop-blur-sm">
        <div className="flex items-center justify-between p-[2em]">
          {/* Logo + Name — pixel-matched to StaggeredMenu header */}
          <Link href="/" className="flex items-center gap-2 md:gap-3 select-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/DexDev-Logo-96.png"
              alt="Dexter Jethro Enriquez"
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
          <button
            onClick={() => navigate("/?from=archive")}
            className="inline-flex items-center gap-[0.3rem] font-mono font-medium leading-none tracking-[0.12em] uppercase text-xs text-black hover:opacity-60 transition-opacity duration-200 cursor-pointer bg-transparent border-none p-0"
          >
            <span>Return</span>
            <span className="relative w-[14px] h-[14px] shrink-0 inline-flex items-center justify-center">
              <span className="absolute left-1/2 top-1/2 w-full h-[2px] bg-current rounded-[2px] -translate-x-1/2 -translate-y-1/2" />
            </span>
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 md:px-12 pt-32 pb-24">
        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mb-14"
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

          {/* Live stat strip — derived from data, always current */}
          <div className="mt-6 flex flex-wrap items-center gap-4 md:gap-6">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-[#FFB800]" />
              <span className="font-mono text-[10px] tracking-wider text-black/40 uppercase">
                {stats.entries} Entries
              </span>
            </div>
            <span className="w-[1px] h-3 bg-black/[0.08]" />
            <span className="font-mono text-[10px] tracking-wider text-black/30 uppercase">
              {stats.years} Active Years
            </span>
            <span className="w-[1px] h-3 bg-black/[0.08]" />
            <span className="font-mono text-[10px] tracking-wider text-black/30 uppercase">
              {stats.technologies} Technologies
            </span>
          </div>
        </motion.div>

        {/* ── Column header rail ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
          className={`${LEDGER_GRID} pb-2 pl-4 md:pl-5 pr-2 md:pr-3 border-b border-black/[0.1]`}
        >
          <span className="font-mono text-[8px] tracking-[0.3em] text-black/25 uppercase">No.</span>
          <span className="font-mono text-[8px] tracking-[0.3em] text-black/25 uppercase">Project</span>
          <span className="hidden md:block font-mono text-[8px] tracking-[0.3em] text-black/25 uppercase">Classification</span>
          <span className="font-mono text-[8px] tracking-[0.3em] text-black/25 uppercase text-right md:text-left">Date</span>
          <span className="hidden md:block" />
        </motion.div>

        {/* ── Ledger ── */}
        <div>
          {groups.map(({ year, entries, startIndex }, groupIdx) => (
            <div key={year}>
              <YearGroupHeader year={year} count={entries.length} groupIdx={groupIdx} />
              <div className="border-t border-black/[0.06]">
                {entries.map((entry, i) => {
                  const globalIdx = startIndex + i;
                  return (
                    <LedgerRow
                      key={entry.project}
                      entry={entry}
                      index={globalIdx}
                      staggerIdx={i}
                      isOpen={openIndex === globalIdx}
                      onToggle={() =>
                        setOpenIndex(openIndex === globalIdx ? null : globalIdx)
                      }
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* ── Footer diagnostic ── */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: EASE }}
          className="mt-20 flex justify-center"
        >
          <div className="relative inline-block px-10 py-5">
            <ViewportBrackets color="rgba(0,0,0,0.08)" />
            <span className="font-mono text-[8px] tracking-[0.35em] text-black/25 uppercase flex items-center gap-3">
              <span className="w-1 h-1 bg-[#FFB800] inline-block" />
              End of Log · Archive v2
            </span>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
