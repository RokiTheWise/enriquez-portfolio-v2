"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ═══════════════════════════════════════════
   Visual Card — right-side sticky panel
   HUD-style card for each activity
   ═══════════════════════════════════════════ */

function ActivityCard({
  index,
  highlight,
  accentColor,
  image,
  objectPosition,
}: {
  index: string;
  highlight: string;
  accentColor: string;
  image: string;
  objectPosition?: string;
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
          style={objectPosition ? { objectPosition } : undefined}
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
      highlight: "Editor-in-Chief • Division Champion",
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
      highlight: "Published Study • Marine Biodiversity",
      accentColor: "#00D4FF",
      image: "/Research.jpeg",
      objectPosition: "top",
    },
  },
  {
    title: "Civic Leadership",
    description:
      "Served as Student Body President during the first full face-to-face school year post-pandemic. Led reform initiatives, community programs, and represented student interests in institutional affairs.",
    card: {
      index: "04",
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
      highlight: "Peer Educator • Kabarkada Founder",
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
      highlight: "Varsity Chess • Multi-sport",
      accentColor: "#34D399",
      image: "/chess.jpg",
    },
  },
];

/* ═══════════════════════════════════════════
   Section Component
   ═══════════════════════════════════════════ */

export function BeyondTheCodeContent({
  activeCard,
}: {
  activeCard: number;
}) {
  const active = ACTIVITIES[Math.min(Math.max(activeCard, 0), ACTIVITIES.length - 1)];

  return (
    <div className="relative w-full h-full bg-white overflow-hidden">
      <div className="relative h-full max-w-5xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-16 pt-44 pb-12 lg:py-0">
        {/* Header */}
        <div className="absolute top-24 left-6 md:left-12 right-6">
          <h2 className="font-mono text-3xl md:text-6xl font-bold tracking-tighter text-black uppercase">
            Beyond the Code
          </h2>
          <div className="mt-2 font-mono text-[10px] md:text-xs tracking-[0.3em] text-black/25 uppercase">
            Activity Log • Off-screen
          </div>
        </div>

        {/* Visual panel */}
        <div className="order-1 lg:order-2 w-full lg:w-80 aspect-[3/2] lg:aspect-auto lg:h-72 flex-shrink-0 overflow-hidden">
          <ActivityCard
            index={active.card.index}
            highlight={active.card.highlight}
            accentColor={active.card.accentColor}
            image={active.card.image}
            objectPosition={active.card.objectPosition}
          />
        </div>

        {/* Text column — single active entry that cross-fades, on mobile + desktop */}
        <div className="order-2 lg:order-1 w-full max-w-lg">
          {/* Active entry — keyed so consecutive activities cross-fade */}
          <div className="relative min-h-[180px] lg:min-h-[220px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCard}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 6 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-1.5 h-1.5" style={{ background: active.card.accentColor }} />
                  <span className="font-mono text-[9px] tracking-[0.3em] text-black/25 uppercase">
                    {String(activeCard + 1).padStart(2, "0")}
                  </span>
                </div>
                <h3 className="font-mono text-lg md:text-2xl font-bold tracking-tighter text-black uppercase">
                  {active.title}
                </h3>
                <p className="font-mono text-[11px] md:text-xs leading-[1.8] text-black/50 mt-3 max-w-sm">
                  {active.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress dots — fill cumulatively as activities are reached */}
          <div className="flex items-center gap-2.5 mt-8" aria-hidden>
            {ACTIVITIES.map((item, index) => {
              const reached = index <= activeCard;
              const isActive = index === activeCard;
              return (
                <motion.div
                  key={item.title}
                  className="rounded-full"
                  animate={{
                    width: isActive ? 18 : 6,
                    backgroundColor: reached ? item.card.accentColor : "rgba(0,0,0,0.1)",
                    opacity: reached ? (isActive ? 1 : 0.55) : 1,
                  }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  style={{ height: 6 }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
