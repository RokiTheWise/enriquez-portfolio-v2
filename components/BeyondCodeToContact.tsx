"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import { BeyondTheCodeContent } from "@/components/BeyondTheCode";
import ContactContent from "@/components/Contact";

export default function BeyondCodeToContact() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  // Iris close: black overlay expands from 0→150% (Phase 2: 40→60%)
  // Then holds at 150% (fully covering) through Phase 3 (60→65%)
  const closeRadius = useTransform(
    scrollYProgress,
    [0, 0.40, 0.60, 1.0],
    [0, 0, 150, 150],
  );
  const closeClipPath = useMotionTemplate`circle(${closeRadius}% at 50% 50%)`;

  // Contact reveal: iris opens from 0→150% (Phase 4: 65→100%)
  const openRadius = useTransform(
    scrollYProgress,
    [0, 0.65, 1.0],
    [0, 0, 150],
  );
  const openClipPath = useMotionTemplate`circle(${openRadius}% at 50% 50%)`;

  // Contact pointer events: interactive only when fully open
  const pointerEvents = useTransform(scrollYProgress, (v) =>
    v > 0.85 ? ("auto" as const) : ("none" as const),
  );

  // HUD: crosshair appears as iris starts closing, fades as it reaches pinhole
  const crosshairOpacity = useTransform(
    scrollYProgress,
    [0.38, 0.42, 0.60, 0.65],
    [0, 0.6, 0.6, 0],
  );

  // Label "Aperture // Opening" mirrors crosshair timing
  const labelOpacity = useTransform(
    scrollYProgress,
    [0.38, 0.42, 0.55, 0.62],
    [0, 0.85, 0.85, 0],
  );

  // Amber accent ring
  const ringScale = useTransform(
    scrollYProgress,
    [0.40, 0.60],
    [0, 2.4],
  );
  const ringOpacity = useTransform(
    scrollYProgress,
    [0.40, 0.42, 0.58, 0.62],
    [0, 0.55, 0.4, 0],
  );

  return (
    <section id="beyond" className="relative bg-black">
      {/*
        Wrapper height = BeyondTheCode scroll height + aperture phases.
        ~600vh covers 6 activity cards at ~100vh each.
        ~150vh for close + open aperture phases.
        Total: ~750vh
      */}
      <div ref={wrapperRef} className="relative h-[750vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden">

          {/* Layer 1: BeyondTheCode — always visible, no clip */}
          <div className="absolute inset-0 z-10 overflow-hidden">
            <BeyondTheCodeContent />
          </div>

          {/* Layer 2: Black iris closing over BeyondTheCode */}
          <motion.div
            style={{ clipPath: closeClipPath }}
            className="absolute inset-0 z-20 bg-black pointer-events-none"
          />

          {/* Layer 3: Contact content — revealed by opening iris */}
          <motion.div
            style={{ clipPath: openClipPath }}
            className="absolute inset-0 z-30"
          >
            <motion.div style={{ pointerEvents }} className="w-full h-full">
              <ContactContent pointerEvents="auto" />
            </motion.div>
          </motion.div>

          {/* Layer 4: HUD — crosshair */}
          <motion.svg
            style={{ opacity: crosshairOpacity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none"
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

          {/* Layer 4: HUD — label */}
          <motion.div
            style={{ opacity: labelOpacity }}
            className="absolute inset-x-0 top-1/2 z-40 flex -translate-y-1/2 flex-col items-center gap-3 pointer-events-none"
          >
            <span className="font-mono text-[9px] md:text-[10px] tracking-[0.4em] text-[#FFB800]/80 uppercase">
              [ Aperture // Opening ]
            </span>
          </motion.div>

          {/* Layer 4: HUD — amber accent ring */}
          <motion.div
            style={{ scale: ringScale, opacity: ringOpacity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 pointer-events-none w-[100vmax] h-[100vmax] rounded-full border border-[#FFB800]/50"
          />
        </div>
      </div>

      {/* Contact anchor target — positioned at the point where iris is fully open */}
      <div id="contact" className="absolute bottom-0 left-0" />
    </section>
  );
}
