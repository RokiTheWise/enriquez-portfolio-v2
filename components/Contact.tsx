"use client";

import Image from "next/image";
import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
} from "framer-motion";

/* ── Social Data ── */

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/RokiTheWise" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/dexter-jethro-enriquez/" },
  { label: "Instagram", href: "https://www.instagram.com/dexjet_enriquez/" },
  { label: "Facebook", href: "https://www.facebook.com/dexterjethro.enriquez" },
];

const ARM = 20;

function CornerBrackets({ color = "#FFB800" }: { color?: string }) {
  return (
    <>
      <svg className="absolute top-0 left-0 pointer-events-none" width={ARM} height={ARM}>
        <path d={`M0 ${ARM} L0 0 L${ARM} 0`} fill="none" stroke={color} strokeWidth="1" />
      </svg>
      <svg className="absolute top-0 right-0 pointer-events-none" width={ARM} height={ARM}>
        <path d={`M0 0 L${ARM} 0 L${ARM} ${ARM}`} fill="none" stroke={color} strokeWidth="1" />
      </svg>
      <svg className="absolute bottom-0 left-0 pointer-events-none" width={ARM} height={ARM}>
        <path d={`M0 0 L0 ${ARM} L${ARM} ${ARM}`} fill="none" stroke={color} strokeWidth="1" />
      </svg>
      <svg className="absolute bottom-0 right-0 pointer-events-none" width={ARM} height={ARM}>
        <path d={`M0 ${ARM} L${ARM} ${ARM} L${ARM} 0`} fill="none" stroke={color} strokeWidth="1" />
      </svg>
    </>
  );
}

/* ── Contact Section — Iris / Aperture Wipe ── */

export default function Contact() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  const radius = useTransform(scrollYProgress, [0, 0.55], [0, 150]);
  const clipPath = useMotionTemplate`circle(${radius}% at 50% 50%)`;

  const ringScale = useTransform(scrollYProgress, [0, 0.55], [0, 2.4]);
  const ringOpacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.45, 0.58],
    [0, 0.55, 0.4, 0],
  );

  const labelOpacity = useTransform(
    scrollYProgress,
    [0, 0.04, 0.18],
    [0, 0.85, 0],
  );
  const crosshairOpacity = useTransform(
    scrollYProgress,
    [0, 0.04, 0.22],
    [0, 0.6, 0],
  );

  const pointerEvents = useTransform(scrollYProgress, (v) =>
    v > 0.5 ? ("auto" as const) : ("none" as const),
  );

  return (
    <section id="contact" className="relative bg-black">
      <div ref={wrapperRef} className="relative h-[200vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">

          {/* Closed-aperture HUD */}
          <motion.div
            style={{ opacity: labelOpacity }}
            className="absolute inset-x-0 top-1/2 z-10 flex -translate-y-1/2 flex-col items-center gap-3 pointer-events-none"
          >
            <span className="font-mono text-[9px] md:text-[10px] tracking-[0.4em] text-[#FFB800]/80 uppercase">
              [ Aperture // Opening ]
            </span>
          </motion.div>

          {/* Crosshair */}
          <motion.svg
            style={{ opacity: crosshairOpacity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
            width="56"
            height="56"
            viewBox="0 0 56 56"
            fill="none"
          >
            <circle cx="28" cy="28" r="10" stroke="#FFB800" strokeOpacity="0.5" strokeWidth="1" />
            <line x1="28" y1="0" x2="28" y2="18" stroke="#FFB800" strokeOpacity="0.5" strokeWidth="1" />
            <line x1="28" y1="38" x2="28" y2="56" stroke="#FFB800" strokeOpacity="0.5" strokeWidth="1" />
            <line x1="0" y1="28" x2="18" y2="28" stroke="#FFB800" strokeOpacity="0.5" strokeWidth="1" />
            <line x1="38" y1="28" x2="56" y2="28" stroke="#FFB800" strokeOpacity="0.5" strokeWidth="1" />
          </motion.svg>

          {/* Accent rim */}
          <motion.div
            style={{ scale: ringScale, opacity: ringOpacity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none w-[100vmax] h-[100vmax] rounded-full border border-[#FFB800]/50"
          />

          {/* Contact content — iris-clipped */}
          <motion.div
            style={{ clipPath, pointerEvents }}
            className="absolute inset-0"
          >
            <div className="relative w-full h-full bg-white flex items-center px-8 md:px-16 lg:px-24 gap-8 md:gap-16">
              <CornerBrackets />

              {/* HUD readout — top right */}
              <span className="absolute top-5 right-6 font-mono text-[9px] tracking-[0.3em] text-black/20 uppercase pointer-events-none">
                SIG-OPEN
              </span>

              {/* Illustration — left column */}
              <div className="hidden md:flex flex-col items-center justify-center flex-shrink-0 w-[38%] h-full relative">
                {/* Amber accent line along the right edge */}
                <div className="absolute top-[15%] bottom-[15%] right-0 w-px bg-gradient-to-b from-transparent via-[#FFB800]/40 to-transparent" />
                <Image
                  src="/contact.svg"
                  alt="Get in touch"
                  width={360}
                  height={320}
                  className="w-full max-w-[340px] select-none"
                  priority
                />
              </div>

              {/* Content — right column */}
              <div className="flex flex-col flex-1 min-w-0">
                {/* Tag */}
                <div className="font-mono text-[10px] md:text-xs tracking-[0.3em] text-black/40 uppercase mb-5">
                  [ Signal // Open ]
                </div>

                {/* Heading */}
                <h2 className="font-mono text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter text-black uppercase leading-none mb-4">
                  Get In<br />Touch
                </h2>

                {/* Subtext */}
                <p className="font-mono text-sm md:text-base text-black/70 leading-relaxed max-w-sm mb-8">
                  Have a project in mind, want to collaborate, or just want to say
                  hello? I&rsquo;m always open to new conversations.
                </p>

                {/* CTA */}
                <a
                  href="mailto:dexterjethro.enriquez@gmail.com"
                  className="group inline-flex items-center gap-3 border border-black px-8 py-4 font-mono text-sm font-bold tracking-wider text-black uppercase transition-colors duration-300 hover:bg-[#FFB800] hover:border-[#FFB800] w-fit mb-8"
                >
                  <span>Send a Message</span>
                  <svg
                    className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>

                {/* Social Links */}
                <div className="flex flex-wrap items-center gap-5 mb-10">
                  {SOCIALS.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-[10px] md:text-xs tracking-[0.2em] text-black/50 uppercase transition-colors duration-300 hover:text-[#FFB800]"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>

                {/* Footer */}
                <span className="font-mono text-[9px] tracking-[0.2em] text-black/30 uppercase">
                  &copy; {new Date().getFullYear()} Dexter Jethro Enriquez
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
