"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
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
  const contentRef = useRef<HTMLDivElement>(null);
  const contentInView = useInView(contentRef, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="relative w-full bg-white overflow-hidden">
      {/* Macbook transition — opens lid as you scroll, then scrolls away */}
      <MacbookScroll
        src="/Aklatang-Galera.png"
        showGradient={false}
        title={
          <span className="font-mono text-[10px] md:text-xs tracking-[0.3em] text-black/20 uppercase">
            [ Scroll to connect ]
          </span>
        }
      />

      {/* Contact content — revealed as macbook scrolls up and away */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center text-center px-6 pb-20 pt-10 -mt-32 max-w-2xl mx-auto"
      >
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
          Have a project in mind, want to collaborate, or just want to say hello?
          I&rsquo;m always open to new conversations.
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

        {/* Footer credit */}
        <div className="mt-16">
          <span className="font-mono text-[9px] tracking-[0.2em] text-black/15 uppercase">
            &copy; {new Date().getFullYear()} Dexter Jethro Enriquez
          </span>
        </div>
      </div>
    </section>
  );
}
