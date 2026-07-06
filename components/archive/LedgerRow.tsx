"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EASE } from "@/lib/motion";
import type { ArchiveEntry } from "./data";
import { formatIndex } from "./data";
import LedgerDossier from "./LedgerDossier";

/* Shared grid template — column rail in page.tsx must match. */
export const LEDGER_GRID =
  "grid grid-cols-[2.5rem_minmax(0,1fr)_auto] md:grid-cols-[3.5rem_minmax(0,1fr)_13rem_7rem_2.5rem] items-center gap-x-3 md:gap-x-4";

export default function LedgerRow({
  entry,
  index,
  isOpen,
  onToggle,
  staggerIdx,
}: {
  entry: ArchiveEntry;
  index: number; // global ledger index (0-based)
  isOpen: boolean;
  onToggle: () => void;
  staggerIdx: number; // position within year group, for entrance stagger
}) {
  const [hovered, setHovered] = useState(false);
  const accent = entry.accentColor;
  const lit = hovered || isOpen;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: staggerIdx * 0.05, ease: EASE }}
      className="relative border-b border-black/[0.06] overflow-hidden"
    >
      {/* Faint project screenshot bleeds through the row on hover.
          Masked toward the left so the text stays readable; hidden
          while the dossier is open (the real screenshot takes over). */}
      {entry.image && (
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden
          style={{
            opacity: hovered && !isOpen ? 0.14 : 0,
            transition: "opacity 0.45s ease",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={entry.image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              objectPosition: entry.imagePosition ?? "center",
              maskImage:
                "linear-gradient(to left, black 30%, transparent 92%)",
              WebkitMaskImage:
                "linear-gradient(to left, black 30%, transparent 92%)",
              transform: hovered && !isOpen ? "scale(1)" : "scale(1.04)",
              transition: "transform 0.6s ease",
            }}
          />
        </div>
      )}

      {/* Collapsed row — real button for keyboard access */}
      <button
        type="button"
        onClick={onToggle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        aria-expanded={isOpen}
        className={`${LEDGER_GRID} w-full text-left py-4 md:py-6 pl-4 md:pl-5 pr-2 md:pr-3 cursor-pointer bg-transparent border-none`}
      >
        {/* NO. */}
        <span
          className="font-mono text-[10px] md:text-xs tracking-[0.15em] transition-colors duration-300"
          style={{ color: lit ? accent : "rgba(0,0,0,0.3)" }}
        >
          {formatIndex(index)}
        </span>

        {/* PROJECT (+ classification stacked beneath on mobile) */}
        <span className="flex flex-col min-w-0">
          <span
            className="font-mono text-sm md:text-lg font-bold tracking-tight text-black uppercase leading-tight truncate transition-transform duration-300"
            style={{ transform: lit ? "translateX(6px)" : "translateX(0)" }}
          >
            {entry.project}
            {entry.collaborators && (
              <span className="ml-2 font-normal text-[9px] md:text-[10px] tracking-[0.15em] text-black/35 align-middle">
                +{entry.collaborators.length}
              </span>
            )}
          </span>
          <span className="md:hidden font-mono text-[8px] tracking-[0.25em] text-black/40 uppercase mt-1">
            {entry.classification}
          </span>
        </span>

        {/* CLASSIFICATION (desktop column) */}
        <span className="hidden md:block font-mono text-[9px] tracking-[0.25em] text-black/40 uppercase truncate">
          {entry.classification}
        </span>

        {/* DATE */}
        <span className="font-mono text-[9px] md:text-[10px] tracking-[0.2em] text-black/35 uppercase whitespace-nowrap text-right md:text-left">
          {entry.month ? `${entry.month} ` : ""}
          {entry.year}
        </span>

        {/* Affordance: ↗ on hover, ✕ while open */}
        <span
          className="hidden md:flex items-center justify-center font-mono text-sm transition-all duration-300"
          style={{
            color: accent,
            opacity: lit ? 1 : 0,
            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
          }}
          aria-hidden
        >
          {isOpen ? "+" : "↗"}
        </span>
      </button>

      {/* Inline dossier */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="dossier"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="overflow-hidden"
          >
            <LedgerDossier entry={entry} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
