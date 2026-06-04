"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionTemplate,
  useMotionValueEvent,
} from "framer-motion";
import { BeyondTheCodeContent } from "@/components/BeyondTheCode";
import ContactContent from "@/components/Contact";

export default function BeyondCodeToContact() {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  /*
    Architecture (mobile-safe, single scroll surface):
    - Outer 1050vh (mobile) / 900vh (desktop) wrapper drives scrollYProgress 0→1.
    - One sticky viewport pins to screen for the whole journey.
    - BeyondTheCode renders statically inside the pin. The active activity card
      is derived from scrollYProgress (0→0.75 split into 6 equal bands) and
      passed to BeyondTheCodeContent as `activeCard` — no nested scroll container,
      so touch always drives the native page (this fixes the mobile scroll-trap).
    - Iris transition: BeyondTheCode clip shrinks 150→0 (0.75→0.85), pinhole hold
      (0.85→0.88), then Contact clip grows 0→150 (0.88→1.0).
  */

  // BeyondTheCode owns progress 0→0.75, split into 6 equal bands (snap-swap).
  const CARD_COUNT = 6;
  const BTC_PHASE_END = 0.75;
  const [activeCard, setActiveCard] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const band = Math.floor((v / BTC_PHASE_END) * CARD_COUNT);
    const next = Math.min(Math.max(band, 0), CARD_COUNT - 1);
    setActiveCard((prev) => (prev === next ? prev : next));
  });

  // BeyondTheCode iris: full open until 75%, closes to pinhole at 85%
  const btcRadius = useTransform(
    scrollYProgress,
    [0, 0.75, 0.85],
    [150, 150, 0],
  );
  const btcClipPath = useMotionTemplate`circle(${btcRadius}% at 50% 50%)`;

  // Contact iris: closed until 88%, open at 100%
  const contactRadius = useTransform(
    scrollYProgress,
    [0, 0.88, 1.0],
    [0, 0, 150],
  );
  const contactClipPath = useMotionTemplate`circle(${contactRadius}% at 50% 50%)`;

  // Contact interactive only near fully open
  const pointerEvents = useTransform(scrollYProgress, (v) =>
    v > 0.96 ? ("auto" as const) : ("none" as const),
  );

  // HUD crosshair: fades in just as iris starts closing
  const crosshairOpacity = useTransform(
    scrollYProgress,
    [0.73, 0.76, 0.84, 0.89],
    [0, 0.6, 0.6, 0],
  );

  // Amber ring
  const ringScale = useTransform(scrollYProgress, [0.75, 0.85], [0, 2.4]);
  const ringOpacity = useTransform(
    scrollYProgress,
    [0.75, 0.77, 0.84, 0.88],
    [0, 0.55, 0.4, 0],
  );

  return (
    <section id="beyond" className="relative bg-black">
      {/*
        Wrapper height = scroll budget. ~75% covers the 6 activity cards
        (snap-swap), the remaining ~25% drives the iris into Contact.
        Mobile gets extra height (1050vh) so each card band feels unhurried.
        Keep vh (NOT dvh) — dvh on the pin breaks Lenis.
      */}
      <div ref={wrapperRef} className="relative h-[1050vh] lg:h-[900vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden">

          <motion.div
            style={{ clipPath: btcClipPath }}
            className="absolute inset-0 z-10"
          >
            <div className="w-full h-full overflow-hidden">
              <BeyondTheCodeContent activeCard={activeCard} />
            </div>
          </motion.div>

          {/* Contact — opening iris */}
          <motion.div
            style={{ clipPath: contactClipPath }}
            className="absolute inset-0 z-20"
          >
            <motion.div style={{ pointerEvents }} className="w-full h-full">
              <ContactContent />
            </motion.div>
          </motion.div>

          {/* HUD — crosshair */}
          <motion.svg
            style={{ opacity: crosshairOpacity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none"
            width="56" height="56" viewBox="0 0 56 56" fill="none"
          >
            <circle cx="28" cy="28" r="10" stroke="#FFB800" strokeOpacity="0.5" strokeWidth="1" />
            <line x1="28" y1="0" x2="28" y2="18" stroke="#FFB800" strokeOpacity="0.5" strokeWidth="1" />
            <line x1="28" y1="38" x2="28" y2="56" stroke="#FFB800" strokeOpacity="0.5" strokeWidth="1" />
            <line x1="0" y1="28" x2="18" y2="28" stroke="#FFB800" strokeOpacity="0.5" strokeWidth="1" />
            <line x1="38" y1="28" x2="56" y2="28" stroke="#FFB800" strokeOpacity="0.5" strokeWidth="1" />
          </motion.svg>

          {/* HUD — amber accent ring */}
          <motion.div
            style={{ scale: ringScale, opacity: ringOpacity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none w-[100vmax] h-[100vmax] rounded-full border border-[#FFB800]/50"
          />
        </div>
      </div>

      <div id="contact" className="absolute bottom-0 left-0" />
    </section>
  );
}
