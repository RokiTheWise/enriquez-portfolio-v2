"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { StickyScroll } from "@/components/ui/sticky-scroll-reveal";

/* ═══════════════════════════════════════════
   Visual Card — right-side sticky panel
   HUD-style card for each activity
   ═══════════════════════════════════════════ */

function ActivityCard({
  index,
  highlight,
  accentColor,
  image,
}: {
  index: string;
  highlight: string;
  accentColor: string;
  image: string;
}) {
  const arm = 20;
  return (
    <div className="relative flex h-full w-full flex-col border border-black/[0.06] bg-white overflow-hidden">
      {/* Corner brackets */}
      <svg className="absolute top-0 left-0 z-10" width={arm} height={arm}>
        <path d={`M0 ${arm} L0 0 L${arm} 0`} fill="none" stroke={accentColor} strokeWidth="1" />
      </svg>
      <svg className="absolute top-0 right-0 z-10" width={arm} height={arm}>
        <path d={`M0 0 L${arm} 0 L${arm} ${arm}`} fill="none" stroke={accentColor} strokeWidth="1" />
      </svg>
      <svg className="absolute bottom-0 left-0 z-10" width={arm} height={arm}>
        <path d={`M0 0 L0 ${arm} L${arm} ${arm}`} fill="none" stroke={accentColor} strokeWidth="1" />
      </svg>
      <svg className="absolute bottom-0 right-0 z-10" width={arm} height={arm}>
        <path d={`M0 ${arm} L${arm} ${arm} L${arm} 0`} fill="none" stroke={accentColor} strokeWidth="1" />
      </svg>

      {/* Image */}
      <div className="relative flex-1">
        <img
          src={image}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px]" style={{ background: accentColor }} />
      </div>

      {/* Bottom: index + highlight */}
      <div className="flex items-center gap-2 px-4 py-3 bg-white">
        <span
          className="font-mono text-[10px] tracking-[0.2em] font-bold uppercase"
          style={{ color: accentColor }}
        >
          {index}
        </span>
        <span className="font-mono text-[9px] tracking-[0.15em] text-black/30 uppercase">
          {highlight}
        </span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Content Data
   ═══════════════════════════════════════════ */

const ACTIVITIES = [
  {
    title: "Public Communication",
    description:
      "Experienced speaker and emcee across academic and organizational events. Translates technical and complex ideas into clear, engaging delivery for diverse audiences.",
    card: {
      index: "01",
      label: "Public Communication",
      highlight: "Speaker & Emcee",
      accentColor: "#FFB800",
      image: "/publicspeaking.jpeg",
    },
  },
  {
    title: "Technical Writing",
    description:
      "Journalism background as Editor-in-Chief of two school publications, with individual championships in English editorial writing at the division level. Brings the same editorial rigor to documentation and written communication.",
    card: {
      index: "02",
      label: "Technical Writing",
      highlight: "Editor-in-Chief // Division Champion",
      accentColor: "#CCFF00",
      image: "/writing.jpeg",
    },
  },
  {
    title: "Research",
    description:
      "Co-led a published marine biodiversity study — from field data collection to stakeholder-facing outputs. Applies empirical thinking and structured analysis to problem-solving across domains.",
    card: {
      index: "03",
      label: "Research",
      highlight: "Published Study // Marine Biodiversity",
      accentColor: "#00D4FF",
      image: "/Research.jpeg",
    },
  },
  {
    title: "Civic Leadership",
    description:
      "Served as Student Body President during the first full face-to-face school year post-pandemic. Led reform initiatives, community programs, and represented student interests in institutional affairs.",
    card: {
      index: "04",
      label: "Civic Leadership",
      highlight: "Student Body President",
      accentColor: "#FF6B6B",
      image: "/studentleader.JPG",
    },
  },
  {
    title: "Youth Advocacy",
    description:
      "Peer Educator at Stairway Foundation, conducting sessions on children's rights, mental health, and online safety. Contributed to founding Kabarkada — a now-institutionalized student-led advocacy organization.",
    card: {
      index: "05",
      label: "Youth Advocacy",
      highlight: "Peer Educator // Kabarkada Founder",
      accentColor: "#A78BFA",
      image: "/youthadvocacy.jpeg",
    },
  },
  {
    title: "Sports & Competition",
    description:
      "Varsity chess player since Grade 2, representing Puerto Galera in unit-wide and provincial-wide competitions. Outside of competition, stays active through basketball, pickleball, table tennis, and badminton.",
    card: {
      index: "06",
      label: "Sports & Competition",
      highlight: "Varsity Chess // Multi-sport",
      accentColor: "#34D399",
      image: "/chess.jpg",
    },
  },
];

const content = ACTIVITIES.map((a) => ({
  title: a.title,
  description: a.description,
  content: (
    <ActivityCard
      index={a.card.index}
      highlight={a.card.highlight}
      accentColor={a.card.accentColor}
      image={a.card.image}
    />
  ),
}));

/* ═══════════════════════════════════════════
   Section Component
   ═══════════════════════════════════════════ */

export default function BeyondTheCode() {
  const headingRef = useRef<HTMLDivElement>(null);
  const headingInView = useInView(headingRef, { once: true, margin: "-80px" });

  return (
    <section
      id="beyond"
      className="relative z-10 w-full bg-white px-6 md:px-12 py-24 md:py-32"
    >
      {/* Section header */}
      <motion.div
        ref={headingRef}
        initial={{ opacity: 0, y: 20 }}
        animate={headingInView ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="sticky top-24 z-20 bg-white pb-6 mb-4 md:mb-8 max-w-5xl mx-auto"
      >
        <h2 className="font-mono text-4xl md:text-6xl font-bold tracking-tighter text-black uppercase">
          Beyond the Code
        </h2>
        <div className="mt-3 font-mono text-[10px] md:text-xs tracking-[0.3em] text-black/25 uppercase">
          Activity Log // Off-screen
        </div>
      </motion.div>

      {/* Sticky Scroll */}
      <div className="max-w-5xl mx-auto">
        <StickyScroll content={content} />
      </div>
    </section>
  );
}
