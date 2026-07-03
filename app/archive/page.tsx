"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import ContactParticles from "@/components/contact/ContactParticles";
import { usePageTransition } from "@/components/PageTransition";
import {
  siNextdotjs,
  siTypescript,
  siTailwindcss,
  siFramer,
  siReact,
  siGsap,
  siPython,
  siTinkercad,
  siXyflow,
  siLucide,
  siArduino,
  siCplusplus,
  siPandas,
  siNumpy,
} from "simple-icons";

const TECH_ICONS: Record<string, { path: string; color: string }> = {
  "Next.js":        { path: siNextdotjs.path,   color: "#000000" },
  "TypeScript":     { path: siTypescript.path,   color: "#3178C6" },
  "Tailwind":       { path: siTailwindcss.path,  color: "#06B6D4" },
  "Framer Motion":  { path: siFramer.path,       color: "#0055FF" },
  "React":          { path: siReact.path,        color: "#61DAFB" },
  "GSAP":           { path: siGsap.path,         color: "#88CE02" },
  "Python":         { path: siPython.path,       color: "#3776AB" },
  "Tinkercad":      { path: siTinkercad.path,    color: "#F16022" },
  "React Flow":     { path: siXyflow.path,       color: "#FF0072" },
  "Lucide React":   { path: siLucide.path,       color: "#F56565" },
  "Arduino":        { path: siArduino.path,      color: "#00979D" },
  "C++":            { path: siCplusplus.path,    color: "#00599C" },
  "pandas":         { path: siPandas.path,        color: "#150458" },
  "NumPy":          { path: siNumpy.path,         color: "#013243" },
  "Java":           { path: "M4.645 7.472c2.1.53 4.779.8 8.008.8 3.299 0 5.918-.27 8.008-.8 2.23-.52 3.299-1.22 3.299-1.88 0-.47-.48-.93-1.35-1.28.2.13.35.35.35.59 0 .67-1.01 1.22-3.039 1.68-1.88.41-4.279.7-7.198.7-2.82 0-5.329-.29-7.138-.68-1.95-.48-2.97-1-2.97-1.68 0-.28.13-.52.52-.8-1.22.47-1.88.87-1.88 1.47.07.68 1.16 1.36 3.39 1.88zm4.689-2.16c2.27-.2 2.929-1.659 5.588-1.899 1.31-.1 2.14.16 2.23.62.08.43-.57.72-1.36.78-1.09.11-1.54-.28-1.63-.65-.81.09-.94.43-.9.67.09.46 1.07.92 2.75.76 1.9-.15 2.54-.9 2.38-1.65-.2-.98-1.66-1.8-4.28-1.55-3.359.3-3.339 1.86-5.628 2.05-.94.09-1.46-.13-1.55-.5-.06-.37.4-.55.94-.59.5-.05 1.11.04 1.4.2.21-.11.28-.22.26-.35-.1-.35-.79-.5-1.66-.44-1.7.15-1.7.91-1.64 1.25.17.87 1.48 1.45 3.1 1.3zm11.417 3.84c-2.1.49-4.779.809-8.008.809-3.3 0-5.989-.34-8.078-.8-1.88-.48-2.88-1.01-3.23-1.56.18 1.23.49 2.42.89 3.55-.48.3-.91.67-1.3 1.17a4.519 4.519 0 00-1.019 3.098 3.6 3.599 0 001.42 2.62c.87.68 1.81.88 2.879.68.41-.07.87-.28 1.29-.42-.88 0-1.62-.28-2.36-.87a3.55 3.549 0 01-1.49-2.42c-.2-.94 0-1.81.53-2.579.12-.15.25-.28.39-.4.3.73.62 1.45.98 2.12.81 1.23 1.62 2.299 2.43 3.459.35.68.58 1.35.74 2.019a3.899 3.899 0 002.229 1.5c1.15.4 2.35.58 3.579.51h.13a10.197 10.197 0 003.689-.52 4.179 4.179 0 002.16-1.49h.07c.13-.67.35-1.34.67-2.02.799-1.17 1.619-2.229 2.419-3.458A20.995 20.993 0 0024 7.612c-.43.6-1.44 1.13-3.25 1.54z", color: "#2F2625" },
};

function TechIcon({ name }: { name: string }) {
  const icon = TECH_ICONS[name];
  if (!icon) return null;
  return (
    <svg
      width={14}
      height={14}
      viewBox="0 0 24 24"
      fill={icon.color}
      className="flex-shrink-0"
      aria-hidden
    >
      <path d={icon.path} />
    </svg>
  );
}

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
  imagePosition?: string;   // CSS object-position, defaults to "center"
  project: string;
  index: string;
  classification: string;
  description: string;
  tech: { name: string; tag: string }[];
  link?: string;
  github?: string;
  accentColor: string;
  collaborators?: { name: string; github: string }[];
}

const ARCHIVE: ArchiveEntry[] = [
  {
    year: "2026",
    month: "Jul",
    index: "01",
    project: "PBA Player Radar",
    classification: "DATA VISUALIZATION",
    description: "A data viz exercise built while learning pandas + matplotlib for a Data Viz class. It takes a small hand-assembled PBA Finals box score dataset, cleans it — dropping unused columns, removing header/separator rows that leaked into the data, fixing an inconsistent MINS time format, and averaging each player's stats across however many games they appeared in — then normalizes 8 key stats (PTS, OREB, DREB, AST, STL, BLK, FG%, 3P%) on a 0–1 scale relative to the best performer league-wide, not just the two players being compared. This keeps the chart honest: a mediocre finals player shows up as genuinely small even against another mediocre player, instead of being artificially inflated by a two-player comparison. Prompts you to pick two players from a numbered list and renders an overlapping radar chart comparing them.",
    tech: [
      { name: "Python", tag: "CORE" },
      { name: "pandas", tag: "DATA" },
      { name: "NumPy", tag: "COMPUTE" },
      { name: "matplotlib", tag: "VISUALIZATION" },
    ],
    github: "https://github.com/RokiTheWise/PBA-Player-Radar-Statistic.git",
    accentColor: "#EF4444",
    image: "/SampleGraph.webp",
  },
  {
    year: "2026",
    month: "May",
    index: "02",
    project: "Arduino Mastermind",
    classification: "EMBEDDED SYSTEMS",
    description: "A hardware Mastermind code-breaking game on Arduino Uno. The player has 5 attempts to crack a randomly generated 3-digit secret code (digits 1–6) using 4 push buttons — one to cycle digits, one to confirm. A 16×2 I2C LCD displays the current guess and Bulls & Cows feedback after each attempt. RGB LEDs and a buzzer provide distinct audio-visual feedback for input, win, and loss states with custom melodies. Implements a two-pass Bulls & Cows scoring algorithm, button debounce, and auto-reset on game end. Components: Arduino Uno, I2C LCD, push buttons, RGB LEDs, passive buzzer, and resistors.",
    tech: [
      { name: "Arduino", tag: "PLATFORM" },
      { name: "C++", tag: "CORE" },
      { name: "I2C LCD", tag: "HARDWARE" },
      { name: "Digital Logic", tag: "DOMAIN" },
    ],
    link: "https://www.tinkercad.com/things/9bZaeWx1rMC-arduino-mastermind-code-breaking-game",
    accentColor: "#00C853",
    image: "/arduino-mastermind.webp",
    imagePosition: "left top",
  },
  {
    year: "2026",
    month: "Mar",
    index: "03",
    project: "Project DAGYAW",
    classification: "CIVIC TECH",
    description: "A community-driven urban sustainability platform submitted to BlueHacks 2026. Bridges the invisibility gap between citizens and LGUs by transforming subjective reports into objective data through a 70/30 consensus loop — an issue only reaches Resolved if 67% of community voters confirm the fix within 3 days. Features a Watch Mode dashboard with AI-powered issue prioritization (Claude API), real-time external data enrichment via IQAir (PM2.5/CO2) and Open-Meteo (rain/weather), and Supabase Realtime for live pin updates on a React Leaflet map.",
    tech: [
      { name: "Next.js", tag: "FRAMEWORK" },
      { name: "TypeScript", tag: "CORE" },
      { name: "Tailwind", tag: "STYLING" },
      { name: "Supabase", tag: "BACKEND" },
    ],
    link: "https://dagyaw-wine.vercel.app/",
    github: "https://github.com/Sazemii/dagyaw-",
    accentColor: "#60A5FA",
    image: "/dagyaw.webp",
    collaborators: [
      { name: "Carl Jacob Landicho", github: "https://github.com/Sazemii" },
      { name: "Charles Daniel Quinto", github: "https://github.com/CharlesRemarks" },
    ],
  },
  {
    year: "2026",
    month: "Mar",
    index: "04",
    project: "Aklatang Galera",
    classification: "CIVIC TECH",
    description: "A localized civic portal unifying educational resources, livelihood programs, and government services for the people of Puerto Galera. Features a bilingual (Filipino/English) interface, Semantic Scholar-powered library search across 30+ curated databases, a livelihood hub connecting locals to TESDA, DOLE, and DTI resources, and a public services directory for scholarships, eLGU permits, and government transparency feeds — all optimized for mobile-first access.",
    tech: [
      { name: "Next.js", tag: "FRAMEWORK" },
      { name: "TypeScript", tag: "CORE" },
      { name: "Tailwind", tag: "STYLING" },
    ],
    link: "https://aklatang-galera.djenriquez.dev/",
    github: "https://github.com/RokiTheWise/aklatang-galera",
    accentColor: "#CCFF00",
    image: "/aklatang-galera.webp",
  },
  {
    year: "2026",
    month: "Mar",
    index: "05",
    project: "LogiSketch",
    classification: "DIGITAL LOGIC CORE",
    description: "An interactive Boolean logic visualizer that parses equations in real-time and instantly generates truth tables and circuit diagrams. Supports standard AND/OR/NOT gates alongside NAND-only and NOR-only universal logic modes. Built with React Flow for a fully interactive canvas — zoom, pan, and drag nodes. Includes professional trunk-logic wiring, dynamic truth tables, and a one-click PNG report export. Designed for CS students, engineers, and hobbyists who want to go from equation to schematic without the manual work.",
    tech: [
      { name: "Next.js", tag: "FRAMEWORK" },
      { name: "TypeScript", tag: "CORE" },
      { name: "Tailwind", tag: "STYLING" },
    ],
    link: "https://logisketch.djenriquez.dev/",
    github: "https://github.com/RokiTheWise/CircuitBuilder",
    accentColor: "#00D4FF",
    image: "/logisketch.webp",
  },
  {
    year: "2026",
    month: "Jan",
    index: "06",
    project: "Ace & Co. Accounting",
    classification: "PROFESSIONAL WORK",
    description: "Official corporate website for Ang Chua Enriquez & Company, a professional accounting and auditing firm in Manila. Built to establish digital presence and generate leads for tax, audit, and business registration services. Achieved a perfect 100 Lighthouse score with dynamic sitemap and robots.txt generation, semantic HTML structured for 'Accounting Firm Manila' search ranking, Open Graph metadata, and React Server Components via the Next.js App Router. Deployed on Vercel with an atomic CI/CD pipeline.",
    tech: [
      { name: "Next.js", tag: "FRAMEWORK" },
      { name: "TypeScript", tag: "CORE" },
      { name: "Tailwind", tag: "STYLING" },
    ],
    link: "https://www.aceandco.org",
    accentColor: "#FFB800",
    image: "/ace-and-co.webp",
  },
  {
    year: "2026",
    month: "Jan",
    index: "07",
    project: "Portfolio V1",
    classification: "PERSONAL IDENTITY",
    description: "My first deployed portfolio — built to break away from standard resume templates by framing skills and achievements through a technology-operator aesthetic. Features a bento grid project showcase, GSAP-powered pixel transitions for photo reveals, CSS glitch and scanline effects, and a dark 'Obsidian' theme built entirely with Tailwind. My second published web project and my first deep dive into the React ecosystem.",
    tech: [
      { name: "Next.js", tag: "FRAMEWORK" },
      { name: "TypeScript", tag: "CORE" },
      { name: "GSAP", tag: "ANIMATION" },
      { name: "Tailwind", tag: "STYLING" },
    ],
    github: "https://github.com/RokiTheWise/en-portfolio-website.git",
    accentColor: "#FF6B6B",
    image: "/portfolio-v1.webp",
  },
  {
    year: "2026",
    month: "Jan",
    index: "08",
    project: "Majority Voter Circuit",
    classification: "ELECTRONICS",
    description: "A combinational logic circuit that outputs High only when two or more of its three binary inputs are active — the core mechanism behind fault-tolerant redundant systems. Implemented using 74HC08 quad AND gates and 74HC32 quad OR gates, derived from the Boolean expression Y = AB + BC + AC. Designed, simulated, and validated in Tinkercad.",
    tech: [
      { name: "Tinkercad", tag: "PLATFORM" },
      { name: "Digital Logic", tag: "DOMAIN" },
      { name: "Combinational Circuits", tag: "THEORY" },
    ],
    link: "https://www.tinkercad.com/things/55OzGJMnEK3-3-input-majority-voter",
    accentColor: "#A78BFA",
    image: "/3-input-majority-voter.webp",
  },
  {
    year: "2025",
    month: "Nov",
    index: "09",
    project: "Seam Carver",
    classification: "ALGORITHMS",
    description: "Content-aware image resizing via seam carving — removes paths of least visual importance rather than cropping uniformly, preserving image content while shrinking width or height. Built with a pixel energy model using gradient magnitude, a dynamic-programming minimum-seam finder for both vertical and horizontal axes, and a PyQt6 desktop GUI that lets users open an image, preview the computed seam, remove one or many seams in sequence, and save the result. Seam computation runs on background threads to keep the UI responsive. Final project for CSCI 30.",
    tech: [
      { name: "Python", tag: "CORE" },
      { name: "Algorithms", tag: "DOMAIN" },
    ],
    github: "https://github.com/Sazemii/SeamCarving",
    accentColor: "#818CF8",
    image: "/seam-carver.webp",
    collaborators: [
      { name: "Carl Jacob Landicho", github: "https://github.com/Sazemii" },
      { name: "Charles Daniel Quinto", github: "https://github.com/CharlesRemarks" },
    ],
  },
  {
    year: "2025",
    month: "Oct",
    index: "10",
    project: "Guitar Simulator",
    classification: "AUDIO / DSP",
    description: "A real-time keyboard-driven instrument simulator built in Python using the Karplus-Strong algorithm for physically modeled sound synthesis. A ring buffer is seeded with white noise on each keypress; each tick the front sample is averaged with the next, multiplied by a decay factor, and re-enqueued — producing natural string sustain and decay. Covers a 20-note guitar range with octave shifting and auto-strum, plus a full drum kit (kick, snare, toms, hi-hat, crash) with a percussive Karplus-Strong variant that randomly negates averaged samples for a noisier timbre. Audio streamed at 44,100 Hz via pygame.",
    tech: [
      { name: "Python", tag: "CORE" },
      { name: "Algorithms", tag: "DOMAIN" },
    ],
    github: "https://github.com/RokiTheWise/guitar_files",
    accentColor: "#34D399",
    image: "/guitar-sim.webp",
    collaborators: [
      { name: "Carl Jacob Landicho", github: "https://github.com/Sazemii" },
      { name: "Charles Daniel Quinto", github: "https://github.com/CharlesRemarks" },
    ],
  },
  {
    year: "2025",
    month: "May",
    index: "11",
    project: "The Hunt of the Skinwalker",
    classification: "GAME DEV",
    description: "A 2-player asymmetric horror game built with Java Swing. One player is a Hunter armed with a gun; the other is a SkinWalker that can disguise itself as any of 18 environment props. Players connect over a local network and compete across three timed phases — Hide (15s), Hunt (60s), and Revenge (30s) — where the Hunter wins by landing a shot and the SkinWalker wins by surviving into Revenge and landing a melee attack. Features an authoritative server architecture, custom sprite animations (6-frame Hunter, 8-frame SkinWalker), tilemap rendering, real-time position sync at 25 ms intervals, and original sound effects.",
    tech: [
      { name: "Java", tag: "CORE" },
      { name: "Java Swing", tag: "UI" },
      { name: "Networking", tag: "DOMAIN" },
    ],
    github: "https://github.com/RokiTheWise/The-Hunt-of-the-Skinwalker",
    accentColor: "#F97316",
    image: "/java-game.webp",
    collaborators: [
      { name: "Charles Daniel Quinto", github: "https://github.com/CharlesRemarks" },
    ],
  },
  {
    year: "2025",
    month: "Mar",
    index: "12",
    project: "Atenean Stickmin",
    classification: "GAME DEV",
    description: "A Java Swing animation project built around a DrawingObject interface — every primitive shape and composite scene object implements draw(Graphics2D) and adjustX(double), letting the canvas hold a heterogeneous render list. Opens with an animated title screen (falling comets, Ateneo cheer audio), advances through a six-frame classroom intro on a 2.5s timer with the Wii Theme, then branches into two user-selectable interactive scenes: a coding scene and a ritual scene. All visuals are drawn programmatically — no image assets, just ~30 custom shape and composite classes.",
    tech: [
      { name: "Java", tag: "CORE" },
      { name: "Java Swing", tag: "UI" },
    ],
    github: "https://github.com/RokiTheWise/Atenean-Stickmin",
    accentColor: "#818CF8",
    image: "/Atenean-Stickmin.webp",
    collaborators: [
      { name: "Charles Daniel Quinto", github: "https://github.com/CharlesRemarks" },
    ],
  },
  {
    year: "2024",
    month: "Dec",
    index: "13",
    project: "The Realms of Yggdrasil",
    classification: "GAME DEV",
    description: "A two-player, turn-based card battle game written in Java. Players draw from a shared deck of typed cards (Dragon, Ghost, Fairy, Human) and race to claim 3 tokens by defeating the opponent's active card. Implements a two-pass Bulls & Cows-style damage system with four type matchups — resistances halve incoming damage, weaknesses double it — plus deck import from a custom .txt format. Ships with both a console entry point (GameConsole) and a Swing GUI (SimpleApp/SimpleGUI) with a turn counter, token display, and file-based deck import. Player hand management, draw/discard/swap mechanics, and win-check logic are split across Card, Player, and GameMaster classes.",
    tech: [
      { name: "Java", tag: "CORE" },
      { name: "Java Swing", tag: "UI" },
    ],
    accentColor: "#9333EA",
    image: "/Realms.webp",
  },
  {
    year: "2024",
    month: "Sep",
    index: "14",
    project: "Project Wurdle",
    classification: "CS_FUNDAMENTALS",
    description: "A terminal Wordle reconstruction built under strict constraints — no str.upper(), str.count(), str.find(), or str.join() allowed. Every text operation is implemented from scratch using iterative loops, parallel ASCII-style arrays, and manual frequency counters. Includes single-player (random word), pass-and-play PvP, configurable difficulty (custom guess limit), and an in-game alphabet tracker. A deliberate exercise in understanding data structures and control flow beneath Python's conveniences.",
    tech: [
      { name: "Python", tag: "CORE" },
      { name: "Algorithms", tag: "DOMAIN" },
    ],
    github: "https://github.com/RokiTheWise/Project-Wurdle.git",
    accentColor: "#34D399",
    image: "/wurdle.webp",
    imagePosition: "left top",
  },
  {
    year: "2024",
    month: "Mar",
    index: "15",
    project: "Hello, World.",
    classification: "ORIGIN",
    description: "Not a project — a beginning. During my 80-hour work immersion at the Business Permit and Licensing Office of Puerto Galera's Municipal Government, the workload ran dry after day one. Instead of staring at a phone, I opened a laptop and started an online Python course. By the end of that week I had written a category sorter, a kg-to-lbs converter, a 67-line multi-operation calculator I packaged into a desktop app, a unit length converter (387 lines), a rock-paper-scissors game, and a YouTube downloader with no ads. None of it was assigned. All of it was a choice. That week in March 2024 is where the habit started.",
    tech: [
      { name: "Python", tag: "CORE" },
    ],
    accentColor: "#F59E0B",
    image: "/immersion.webp",
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
      className="h-64"
    >
      <div
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative w-full h-full cursor-pointer overflow-hidden"
        style={{
          borderRadius: "18px",
          boxShadow: hovered
            ? "0 2px 4px rgba(0,0,0,0.04), 0 8px 16px rgba(0,0,0,0.08), 0 24px 48px rgba(0,0,0,0.10)"
            : "0 2px 4px rgba(0,0,0,0.04), 0 4px 8px rgba(0,0,0,0.06), 0 12px 24px rgba(0,0,0,0.08)",
          transition: "box-shadow 0.3s ease, transform 0.3s ease",
          transform: hovered ? "translateY(-2px)" : "translateY(0)",
        }}
      >
        {/* Image or accent placeholder */}
        {entry.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={entry.image}
            alt={entry.project}
            width={800}
            height={256}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              objectPosition: entry.imagePosition ?? "center",
              transform: hovered ? "scale(1.03)" : "scale(1)",
              transition: "transform 0.4s ease",
            }}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: `${entry.accentColor}10` }}
          />
        )}

        {/* Hover overlay — tech icons + brief description */}
        <div
          className="absolute inset-0 z-10 flex flex-col justify-end px-4 py-4"
          style={{
            background: hovered
              ? "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.15) 100%)"
              : "linear-gradient(to top, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.18) 50%, transparent 100%)",
            transition: "background 0.3s ease",
          }}
        >
          {/* Tech icons — fade in on hover */}
          <div
            className="flex items-center gap-2 mb-2"
            style={{
              opacity: hovered ? 1 : 0,
              transform: hovered ? "translateY(0)" : "translateY(6px)",
              transition: "opacity 0.25s ease, transform 0.25s ease",
            }}
          >
            {entry.tech.slice(0, 5).map((t) => {
              const icon = TECH_ICONS[t.name];
              if (!icon) return null;
              return (
                <svg
                  key={t.name}
                  width={14}
                  height={14}
                  viewBox="0 0 24 24"
                  fill="white"
                  opacity={0.75}
                  aria-label={t.name}
                >
                  <path d={icon.path} />
                </svg>
              );
            })}
          </div>

          {/* Brief description — fade in on hover */}
          <p
            className="font-mono text-[9px] leading-[1.6] text-white/70 mb-2 line-clamp-2"
            style={{
              opacity: hovered ? 1 : 0,
              transform: hovered ? "translateY(0)" : "translateY(6px)",
              transition: "opacity 0.25s ease 0.04s, transform 0.25s ease 0.04s",
            }}
          >
            {entry.description}
          </p>

          {/* Title + arrow — always visible */}
          <div className="flex items-end justify-between">
            <h3
              className="font-mono text-xs font-bold tracking-[0.12em] uppercase leading-tight text-white"
            >
              {entry.project}
            </h3>
            <ArrowRight
              size={14}
              style={{
                color: "#fff",
                opacity: hovered ? 1 : 0.8,
                flexShrink: 0,
                transition: "opacity 0.25s ease",
              }}
            />
          </div>
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
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 backdrop-blur-md"
      style={{ background: "rgba(255,255,255,0.15)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 32, scale: 0.97 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full bg-white rounded-[18px] overflow-hidden flex flex-col"
        style={{
          maxWidth: "680px",
          maxHeight: "90vh",
          boxShadow: "0 2px 4px rgba(0,0,0,0.04), 0 8px 16px rgba(0,0,0,0.08), 0 24px 48px rgba(0,0,0,0.14)",
        }}
      >
        {/* Image or accent placeholder with close button overlaid top-left */}
        <div className="relative flex-shrink-0">
          {entry.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={entry.image}
              alt={entry.project}
              width={680}
              height={320}
              className="w-full h-72 object-cover"
              style={{ objectPosition: entry.imagePosition ?? "center" }}
            />
          ) : (
            <div
              className="w-full h-72 flex items-center justify-center"
              style={{ background: `${entry.accentColor}18` }}
            >
              <span
                className="font-mono text-6xl font-bold tracking-tight select-none"
                style={{ color: entry.accentColor }}
              >
                {getInitials(entry.project)}
              </span>
            </div>
          )}
          <button
            onClick={onClose}
            className="absolute top-3 left-3 w-8 h-8 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm transition-colors duration-150 font-mono text-white text-xs"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-6">
          {/* Name + links row */}
          <div className="flex items-start justify-between gap-4 mb-1">
            <h2 className="font-mono text-xl font-bold tracking-tight text-black uppercase leading-tight">
              {entry.project}
            </h2>
            <div className="flex items-center gap-5 flex-shrink-0 pt-1">
              {entry.github && (
                <a
                  href={entry.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.1em] uppercase text-black/40 hover:text-black transition-colors duration-150"
                >
                  <GithubIcon size={15} />
                  Source Code
                </a>
              )}
              {entry.link && (
                <a
                  href={entry.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 font-mono text-xs font-semibold tracking-[0.1em] uppercase text-black/40 hover:text-[#FFB800] transition-colors duration-150"
                >
                  <ArrowUpRight size={15} />
                  Visit Site
                </a>
              )}
            </div>
          </div>

          {/* Classification */}
          <span className="font-mono text-[8px] tracking-[0.2em] text-black/35 uppercase">
            {classificationLabel}
          </span>

          {/* Tech badges */}
          <div className="flex flex-wrap gap-1.5 mt-4 mb-6">
            {entry.tech.map((t) => (
              <span
                key={t.name}
                className="inline-flex items-center gap-1.5 font-mono text-[8px] tracking-wider text-black/35 uppercase px-2 py-0.5"
              >
                <TechIcon name={t.name} />
                {t.name}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className="font-mono text-[11px] leading-[1.9] text-black/50">
            {entry.description}
          </p>

          {/* Collaborators */}
          {entry.collaborators && (
            <div className="mt-4 flex flex-col gap-1">
              <span className="font-mono text-[8px] tracking-[0.3em] text-black/30 uppercase">Built with</span>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                {entry.collaborators.map((c) => (
                  <a
                    key={c.github}
                    href={c.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[11px] text-black/50 hover:text-black transition-colors duration-150 underline underline-offset-2"
                  >
                    {c.name}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}


/* ═══════════════════════════════════════════
   Archive Page
   ═══════════════════════════════════════════ */

export default function ArchivePage() {
  const { navigate } = usePageTransition();
  const [selectedEntry, setSelectedEntry] = useState<ArchiveEntry | null>(null);
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
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
