/* ═══════════════════════════════════════════
   Archive Database — single source of truth
   Consumed by the archive ledger page and by
   FeaturedProjects (entry count).
   ═══════════════════════════════════════════ */

export interface ArchiveEntry {
  year: string;
  month?: string;           // e.g. "Jan", "Mar"
  image?: string;           // path or URL to screenshot/thumbnail
  imagePosition?: string;   // CSS object-position, defaults to "center"
  project: string;
  classification: string;
  description: string;
  tech: { name: string; tag: string }[];
  link?: string;
  github?: string;
  accentColor: string;
  collaborators?: { name: string; github: string }[];
}

export const ARCHIVE: ArchiveEntry[] = [
  {
    year: "2026",
    month: "Jul",
    project: "Pokémon Market Analysis",
    classification: "MARKET RESEARCH",
    description:
      "A Tableau dashboard and written analysis asking whether buying or grading Pokémon cards was actually a good idea in 2025. Across 540 chase cards tracked monthly from January 2021 to November 2025, the median price rose 37.46% — but cutting the same data at the end of 2024 shows it down 22.84%, with 60% of cards underwater instead of 41%. The headline gain is a composition effect: cards enter the dataset as they release, so the sample keeps filling with newer, pricier cards and the median rises because the mix changes, not because anyone's collection gained value. The rest of the analysis turns that into rules a buyer can use — the median card returned roughly 4.4% annually, losing to Philippine land at 8–12%; gains sit almost entirely in 2025-released sets; and grading multiplies value 4.3× under $10 but only 1.2× above $50, so single-card grading only clears its own $25–80 fee above about $125 raw. Medians throughout, since the return distribution has a long right tail — the biggest gain in the data is +14,960% off a $0.05 baseline. Every calculated field was verified separately in pandas.",
    tech: [
      { name: "Tableau", tag: "VISUALIZATION" },
      { name: "Python", tag: "VERIFICATION" },
      { name: "pandas", tag: "DATA" },
      { name: "Statistics", tag: "METHOD" },
    ],
    accentColor: "#3B82F6",
    image: "/pokemon-dashboard.webp",
    collaborators: [
      { name: "Nathaniel Josh B. Quinto", github: "https://github.com/Nutellosaur" },
    ],
  },
  {
    year: "2026",
    month: "Jul",
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
    project: "Recipebook",
    classification: "BACKEND / DJANGO",
    description:
      "A Django app for storing recipes and the ingredients they call for, built to learn the framework's class-based views and relational modelling. The data model is the point: Ingredient and Recipe are separate tables joined by a RecipeIngredient through-model that carries the quantity — so \"flour\" exists once and is reused across every recipe that needs it, each with its own \"2 cups\" or \"250g\". Deletes cascade through the join table, and a recipe reaches its rows via a reverse relation the detail template iterates directly. Public browsing is read-only through RecipeListView and RecipeDetailView; all authoring happens in the Django admin, where the recipe form nests an inline editor so a recipe and its ingredient quantities are entered on one page rather than three.",
    tech: [
      { name: "Django", tag: "FRAMEWORK" },
      { name: "Python", tag: "CORE" },
      { name: "SQLite", tag: "DATABASE" },
      { name: "Django ORM", tag: "DATA MODEL" },
    ],
    github: "https://github.com/RokiTheWise/recipebook-enriquez-dexterjethro",
    accentColor: "#10B981",
    image: "/recipebook.webp",
  },
  {
    year: "2026",
    month: "Mar",
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

/* Group entries by year, newest year first. Within-year order is preserved
   from the ARCHIVE array (already newest-first). */
export function groupByYear(
  entries: ArchiveEntry[],
): { year: string; entries: ArchiveEntry[] }[] {
  const map = new Map<string, ArchiveEntry[]>();
  for (const entry of entries) {
    if (!map.has(entry.year)) map.set(entry.year, []);
    map.get(entry.year)!.push(entry);
  }
  return Array.from(map.entries())
    .sort(([a], [b]) => Number(b) - Number(a))
    .map(([year, entries]) => ({ year, entries }));
}

/* Global ledger index — "001", "002", … continuous across year groups. */
export function formatIndex(i: number): string {
  return String(i + 1).padStart(3, "0");
}
