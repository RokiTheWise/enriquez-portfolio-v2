"use client";

import { useRef, useEffect } from "react";
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
  const innerScrollRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  /*
    Architecture:
    - Outer 750vh wrapper drives scrollYProgress (0→1)
    - Sticky viewport pins to screen for entire journey
    - BeyondTheCode sits in an inner div with overflow-y-scroll
    - JS syncs the inner div's scroll position to the outer page scroll
      so IntersectionObserver fires correctly (it observes the inner scroller)
    - Aperture phase (60%→75%): iris clip on BeyondTheCode layer shrinks 150→0
    - Contact phase (80%→100%): iris clip on Contact grows 0→150
  */

  /*
    Phase map (% of 900vh wrapper):
      0  → 0.75 : BeyondTheCode inner scroll drives cards 01–06
      0.75 → 0.85: Iris CLOSES over BeyondTheCode (150%→0%)
      0.85 → 0.88: Pinhole hold
      0.88 → 1.0 : Iris OPENS — Contact revealed (0%→150%)

    Inner scroll is mapped across the full BeyondTheCode phase (0→0.75).
    This gives ~675vh of outer scroll to cover the inner content height,
    so card 06 settles comfortably before the iris starts.
  */

  // Sync inner scroll to outer page scroll during BeyondTheCode phase (0→75%)
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const inner = innerScrollRef.current;
    if (!wrapper || !inner) return;

    const onScroll = () => {
      const wrapperTop = wrapper.getBoundingClientRect().top;
      const scrolledPx = Math.max(0, -wrapperTop);
      // Drive inner scroll at 1:4 ratio. Clamped so inner freezes on the
      // blank buffer card while outer scroll continues into the iris phase.
      inner.scrollTop = Math.min(
        scrolledPx * 0.25,
        inner.scrollHeight - inner.clientHeight,
      );
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
        Wrapper height: 900vh desktop (desktop-tuned). Mobile gets 1050dvh
        (DYNAMIC viewport height). dvh tracks Chrome mobile's URL bar
        show/hide; if we used vh, the wrapper would jump 12-15% mid-scroll
        when the URL bar toggles, breaking Lenis cache, scrollYProgress, and
        the iris trigger points — manifesting as "stuck scroll" or
        "black screen" glitches.
      */}
      <div ref={wrapperRef} className="relative h-[1050dvh] lg:h-[900vh]">
        <div className="sticky top-0 h-[100dvh] w-full overflow-hidden">

          {/*
            BeyondTheCode in an inner scrollable div.
            JS syncs scrollTop to outer page progress so cards cycle correctly.
            Iris clip shrinks this layer as iris closes.
          */}
          <motion.div
            style={{ clipPath: btcClipPath }}
            className="absolute inset-0 z-10"
          >
            <div
              ref={innerScrollRef}
              className="w-full h-full overflow-y-scroll overflow-x-hidden"
              style={{
                scrollbarWidth: "none",
                // touch-action: pan-y lets the browser route vertical touch
                // pans to the PAGE (not this inner overflow container). We
                // drive inner.scrollTop programmatically from page scroll, so
                // the inner shouldn't consume touches itself. Without this,
                // mobile users get stuck once inner.scrollTop hits its clamp.
                touchAction: "pan-y",
                overscrollBehavior: "none",
              }}
            >
              <BeyondTheCodeContent scrollRoot={innerScrollRef} />
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
