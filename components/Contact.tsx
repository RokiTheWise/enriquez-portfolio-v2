"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";

/* ── Social Data ── */

const SOCIALS = [
  { label: "GitHub", href: "https://github.com/RokiTheWise" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/dexter-jethro-enriquez/" },
  { label: "Instagram", href: "https://www.instagram.com/dexjet_enriquez/" },
  { label: "Facebook", href: "https://www.facebook.com/dexterjethro.enriquez" },
];

/* ── Screen Wipe + Contact Section ── */

export default function Contact() {
  const wipeRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const contentInView = useInView(contentRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: wipeRef,
    offset: ["start end", "start start"],
  });

  // Dramatic wipe: slides up with a slight scale-in
  const y = useTransform(scrollYProgress, [0.1, 0.9], ["100%", "0%"]);
  const scale = useTransform(scrollYProgress, [0.1, 0.9], [1.05, 1]);

  return (
    <div ref={wipeRef} className="relative z-20 h-[150vh]">
      <motion.section
        id="contact"
        style={{ y, scale }}
        className="fixed inset-0 z-50 h-screen bg-[#FFF3D6] flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Amber leading edge — visible during wipe */}
        <motion.div
          style={{ opacity: useTransform(scrollYProgress, [0.2, 0.85, 0.95], [1, 1, 0]) }}
          className="absolute top-0 left-0 right-0 h-[2px] bg-[#FFB800]"
        />

        {/* Corner brackets */}
        <Corner position="top-left" />
        <Corner position="top-right" />
        <Corner position="bottom-left" />
        <Corner position="bottom-right" />

        {/* Content */}
        <div ref={contentRef} className="relative z-10 flex flex-col items-center text-center px-6 max-w-2xl">
          {/* Tag */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={contentInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono text-[10px] md:text-xs tracking-[0.3em] text-black/25 uppercase mb-6"
          >
            [ Signal // Open ]
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={contentInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono text-4xl md:text-6xl font-bold tracking-tighter text-black uppercase"
          >
            Get In Touch
          </motion.h2>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={contentInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 font-mono text-xs md:text-sm text-black/40 tracking-wide leading-relaxed max-w-md"
          >
            Have a project in mind, want to collaborate, or just want to say hello? I&rsquo;m always open to new conversations.
          </motion.p>

          {/* CTA: Send Message */}
          <motion.a
            href="mailto:dexterjethro.enriquez@gmail.com"
            initial={{ opacity: 0, y: 15 }}
            animate={contentInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
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
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </motion.a>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={contentInView ? { opacity: 1, y: 0 } : undefined}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex flex-wrap items-center justify-center gap-6"
          >
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
          </motion.div>
        </div>

        {/* Bottom credit */}
        <div className="absolute bottom-6 left-0 right-0 text-center">
          <span className="font-mono text-[9px] tracking-[0.2em] text-black/15 uppercase">
            &copy; {new Date().getFullYear()} Dexter Jethro Enriquez
          </span>
        </div>
      </motion.section>
    </div>
  );
}

/* ── Corner Bracket ── */

function Corner({ position }: { position: "top-left" | "top-right" | "bottom-left" | "bottom-right" }) {
  const arm = 40;
  const posClasses = {
    "top-left": "top-6 left-6",
    "top-right": "top-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "bottom-right": "bottom-6 right-6",
  };

  const paths = {
    "top-left": `M0 ${arm} L0 0 L${arm} 0`,
    "top-right": `M0 0 L${arm} 0 L${arm} ${arm}`,
    "bottom-left": `M0 0 L0 ${arm} L${arm} ${arm}`,
    "bottom-right": `M0 ${arm} L${arm} ${arm} L${arm} 0`,
  };

  return (
    <svg
      className={`absolute ${posClasses[position]} z-10`}
      width={arm}
      height={arm}
    >
      <path d={paths[position]} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
    </svg>
  );
}
