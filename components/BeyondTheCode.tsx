"use client";

import React from "react";
import { motion } from "framer-motion";

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
      <div className="relative h-full max-w-5xl mx-auto px-6 md:px-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 lg:gap-16 pt-28 pb-12 lg:py-0">
        {/* Header */}
        <div className="absolute top-10 left-6 md:left-12 right-6">
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

        {/* Text column — full dimmed list on desktop, active-only on mobile */}
        <div className="order-2 lg:order-1 max-w-lg">
          {/* Mobile: active entry only */}
          <div className="lg:hidden">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-1.5 h-1.5" style={{ background: active.card.accentColor }} />
              <span className="font-mono text-[9px] tracking-[0.3em] text-black/25 uppercase">
                {String(activeCard + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="font-mono text-lg font-bold tracking-tighter text-black uppercase">
              {active.title}
            </h3>
            <p className="font-mono text-[11px] leading-[1.8] text-black/50 mt-3 max-w-sm">
              {active.description}
            </p>
          </div>

          {/* Desktop: dimmed full list */}
          <div className="hidden lg:block">
            {ACTIVITIES.map((item, index) => (
              <div key={item.title} className="my-10 first:mt-0">
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-1.5 h-1.5"
                    style={{
                      background:
                        activeCard === index ? item.card.accentColor : "rgba(0,0,0,0.08)",
                    }}
                  />
                  <span className="font-mono text-[9px] tracking-[0.3em] text-black/25 uppercase">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>
                <motion.h3
                  animate={{
                    opacity: activeCard === index ? 1 : 0.2,
                    x: activeCard === index ? 0 : -4,
                  }}
                  transition={{ duration: 0.3 }}
                  className="font-mono text-2xl font-bold tracking-tighter text-black uppercase"
                >
                  {item.title}
                </motion.h3>
                <motion.p
                  animate={{ opacity: activeCard === index ? 1 : 0.15 }}
                  transition={{ duration: 0.3 }}
                  className="font-mono text-xs leading-[1.8] text-black/50 mt-3 max-w-sm"
                >
                  {item.description}
                </motion.p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
