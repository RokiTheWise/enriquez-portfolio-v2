"use client";

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

/* ── Contact Section — Iris / Aperture Wipe ── */

export default function Contact() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Wrapper is 200vh tall; inner is sticky 100vh.
  // With offset ["start start", "end end"], progress 0→1 spans exactly
  // the 100vh of scroll where the inner is pinned.
  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  // Iris opens from center: 0% → 150% of the distance to the farthest corner.
  const radius = useTransform(scrollYProgress, [0, 0.55], [0, 150]);
  const clipPath = useMotionTemplate`circle(${radius}% at 50% 50%)`;

  // Accent rim traces the iris edge while it opens, then fades.
  const ringScale = useTransform(scrollYProgress, [0, 0.55], [0, 2.4]);
  const ringOpacity = useTransform(
    scrollYProgress,
    [0, 0.05, 0.45, 0.58],
    [0, 0.55, 0.4, 0],
  );

  // Closed-aperture HUD label fades out as the iris starts opening.
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

  // Gate interaction until the iris is essentially open.
  const pointerEvents = useTransform(scrollYProgress, (v) =>
    v > 0.5 ? ("auto" as const) : ("none" as const),
  );

  return (
    <section id="contact" className="relative bg-black">
      <div ref={wrapperRef} className="relative h-[200vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
          {/* Closed-aperture HUD — faint readout while the iris is shut */}
          <motion.div
            style={{ opacity: labelOpacity }}
            className="absolute inset-x-0 top-1/2 z-10 flex -translate-y-1/2 flex-col items-center gap-3 pointer-events-none"
          >
            <span className="font-mono text-[9px] md:text-[10px] tracking-[0.4em] text-[#FFB800]/80 uppercase">
              [ Aperture // Opening ]
            </span>
          </motion.div>

          {/* Crosshair at center — reinforces the camera-aperture feel */}
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

          {/* Accent rim that traces the iris edge */}
          <motion.div
            style={{ scale: ringScale, opacity: ringOpacity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none w-[100vmax] h-[100vmax] rounded-full border border-[#FFB800]/50"
          />

          {/* Contact content, clipped to the iris circle */}
          <motion.div
            style={{ clipPath, pointerEvents }}
            className="absolute inset-0"
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
        </div>
      </div>
    </section>
  );
}
