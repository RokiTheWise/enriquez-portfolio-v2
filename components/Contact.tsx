"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MacbookScroll } from "@/components/ui/macbook-scroll";

/* ── Social Data ── */

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/RokiTheWise" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/dexter-jethro-enriquez/" },
  { label: "Instagram", href: "https://www.instagram.com/dexjet_enriquez/" },
  { label: "Facebook", href: "https://www.facebook.com/dexterjethro.enriquez" },
];

/* ── Contact Section ── */

export default function Contact() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Track the same scroll space as MacbookScroll
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end start"],
  });

  // Phase 1 (0–0.3): Lid opens. Contact hidden.
  // Phase 2 (0.3–0.55): Contact zooms in from screen size → full viewport. Macbook fades.
  // Phase 3 (0.55+): Contact is full-screen and interactive.
  const contactScale = useTransform(scrollYProgress, [0.28, 0.55], [0.32, 1]);
  const contactOpacity = useTransform(scrollYProgress, [0.26, 0.34], [0, 1]);
  const macbookFade = useTransform(scrollYProgress, [0.3, 0.48], [1, 0]);
  const contactVisibility = useTransform(scrollYProgress, (v) =>
    v > 0.2 ? ("visible" as const) : ("hidden" as const),
  );
  const contactPointer = useTransform(scrollYProgress, (v) =>
    v > 0.5 ? ("auto" as const) : ("none" as const),
  );

  return (
    <section id="contact" className="relative bg-white">
      {/* Scroll container — wraps the MacbookScroll */}
      <div ref={wrapperRef} className="relative">
        <motion.div style={{ opacity: macbookFade }}>
          <MacbookScroll
            showGradient={false}
            title={
              <span className="font-mono text-[10px] md:text-xs tracking-[0.3em] text-black/20 uppercase">
                [ Scroll to connect ]
              </span>
            }
            screenContent={
              <div className="w-full h-full bg-[#FFF3D6] flex flex-col items-center justify-center gap-2">
                <span className="font-mono text-[5px] md:text-[8px] tracking-[0.3em] text-black/20 uppercase">
                  [ Signal // Open ]
                </span>
                <span className="font-mono text-[9px] md:text-sm font-bold tracking-tighter text-black uppercase">
                  Get In Touch
                </span>
                <span className="font-mono text-[3px] md:text-[6px] text-black/30 tracking-wide">
                  dexterjethro.enriquez@gmail.com
                </span>
              </div>
            }
          />
        </motion.div>
      </div>

      {/* Fixed contact overlay — zooms from macbook screen size to full viewport */}
      <motion.div
        style={{
          scale: contactScale,
          opacity: contactOpacity,
          visibility: contactVisibility,
          pointerEvents: contactPointer,
        }}
        className="fixed inset-0 z-50"
      >
        <div className="w-full h-full bg-[#FFF3D6] flex flex-col items-center justify-center px-6">
          <div className="flex flex-col items-center text-center max-w-2xl">
            {/* Tag */}
            <div className="font-mono text-[10px] md:text-xs tracking-[0.3em] text-black/25 uppercase mb-6">
              [ Signal // Open ]
            </div>

            {/* Heading */}
            <h2 className="font-mono text-4xl md:text-6xl font-bold tracking-tighter text-black uppercase">
              Get In Touch
            </h2>

            {/* Subtext */}
            <p className="mt-4 font-mono text-xs md:text-sm text-black/40 tracking-wide leading-relaxed max-w-md">
              Have a project in mind, want to collaborate, or just want to say
              hello? I&rsquo;m always open to new conversations.
            </p>

            {/* CTA: Send Message */}
            <a
              href="mailto:dexterjethro.enriquez@gmail.com"
              className="mt-10 group relative inline-flex items-center gap-3 border border-black px-8 py-4 font-mono text-sm md:text-base font-bold tracking-wider text-black uppercase transition-colors duration-300 hover:bg-[#FFB800] hover:border-[#FFB800]"
            >
              <span>Send a Message</span>
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>

            {/* Social Links */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[10px] md:text-xs tracking-[0.2em] text-black/30 uppercase transition-colors duration-300 hover:text-[#FFB800]"
                >
                  {s.label}
                </a>
              ))}
            </div>

            {/* Footer */}
            <div className="mt-16">
              <span className="font-mono text-[9px] tracking-[0.2em] text-black/15 uppercase">
                &copy; {new Date().getFullYear()} Dexter Jethro Enriquez
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
