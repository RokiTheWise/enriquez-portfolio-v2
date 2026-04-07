"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ── Detail row data ── */

interface Detail {
  label: string;
  value: string;
  accent?: boolean; // amber highlight on value
}

const DETAILS: Detail[] = [
  { label: "Year Level", value: "2nd Year College" },
  { label: "Performance", value: "3.72 QPI", accent: true },
  { label: "Status", value: "Open for Internships", accent: true },
  {
    label: "Education",
    value: "BS Computer Science \u00b7 Ateneo de Manila University",
  },
  {
    label: "Scholarships",
    value:
      "Jose P. Rizal & EO-Ayala Scholar \u00b7 Full University & Corporate Merit",
  },
  {
    label: "Leadership",
    value: "SOSE Sanggunian (HR) \u00b7 Laro Loyola (Secretariat)",
  },
  { label: "Languages", value: "English, Tagalog \u00b7 French (Learning)" },
  { label: "Location", value: "Quezon City, Metro Manila, PH" },
];

/* ── Shared spring ease ── */
const ease = [0.16, 1, 0.3, 1] as const;

/* ── Detail row component ── */

function DetailRow({
  detail,
  index,
  isInView,
}: {
  detail: Detail;
  index: number;
  isInView: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={isInView ? { opacity: 1, x: 0 } : undefined}
      transition={{ duration: 0.6, delay: 0.15 + index * 0.06, ease }}
      className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-0 py-3 md:py-3.5 border-b border-black/[0.06] last:border-b-0"
    >
      <span className="font-mono text-[9px] md:text-[10px] tracking-[0.2em] text-black/30 uppercase md:w-36 flex-shrink-0">
        {detail.label}
      </span>
      <span
        className={`font-mono text-xs md:text-sm tracking-wide leading-relaxed ${
          detail.accent
            ? "text-[#FFB800] font-semibold"
            : "text-black/70"
        }`}
      >
        {detail.value}
      </span>
    </motion.div>
  );
}

/* ── Main Section ── */

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative w-full bg-white px-6 md:px-12 py-24 md:py-32 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto">
        {/* ── Heading ── */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : undefined}
          transition={{ duration: 0.7, ease }}
          className="mb-4 md:mb-6"
        >
          <h2 className="font-mono text-4xl md:text-6xl font-bold tracking-tighter text-black uppercase">
            About
          </h2>
        </motion.div>

        {/* ── Paragraph ── */}
        <motion.p
          initial={{ opacity: 0, x: -30 }}
          animate={isInView ? { opacity: 1, x: 0 } : undefined}
          transition={{ duration: 0.7, delay: 0.08, ease }}
          className="font-mono text-sm md:text-base leading-relaxed text-black/50 max-w-2xl mb-12 md:mb-16"
        >
          I came to Computer Science because I wanted to build things that
          matter. That became a consistent thread of building software for
          communities, tools that reduce friction, products that reach people
          rather than just users.
        </motion.p>

        {/* ── Accent line ── */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={isInView ? { scaleX: 1 } : undefined}
          transition={{ duration: 0.8, delay: 0.1, ease }}
          className="h-[1px] bg-black/[0.08] origin-left mb-1"
        />

        {/* ── Detail registry ── */}
        <div>
          {DETAILS.map((detail, i) => (
            <DetailRow
              key={detail.label}
              detail={detail}
              index={i}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
