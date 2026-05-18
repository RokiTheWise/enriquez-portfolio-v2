"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface StartupLoaderProps {
  onComplete?: () => void;
}

/*
  Three-phase choreography across ~1.4s:
    0.0 → 0.4s : logo scales up from 1.0 → 1.15, amber glow blooms in
    0.4 → 0.8s : holds + single subtle glow pulse
    0.8 → 1.4s : logo flies to top-left header position, white overlay fades

  Target position matches the hero header logo (HeroHUD.tsx):
    - mobile: px-5 py-4 padding, w-7 (28px) logo  → center at (20+14, 16+14) = (34, 30)
    - desktop: px-12 pt-12, w-12 (48px) logo      → center at (48+24, 48+24) = (72, 72)

  We compute from viewport center, transform space.
*/

const LOADER_DURATION_MS = 1400;

export default function StartupLoader({ onComplete }: StartupLoaderProps) {
  const [visible, setVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const t = setTimeout(() => {
      setVisible(false);
    }, LOADER_DURATION_MS);
    return () => clearTimeout(t);
  }, []);

  // Final size + center coordinates of the hero header logo, in px.
  const finalSize = isMobile ? 28 : 48;
  const finalCenterX = isMobile ? 34 : 72;
  const finalCenterY = isMobile ? 30 : 72;

  // Loader logo's "centered hero pose" size — slightly bigger than the
  // final hero header size so the bloom reads as a presence.
  const heroSize = isMobile ? 96 : 144;

  // Translate from viewport center → final header position
  const flyX =
    typeof window !== "undefined" ? finalCenterX - window.innerWidth / 2 : 0;
  const flyY =
    typeof window !== "undefined" ? finalCenterY - window.innerHeight / 2 : 0;

  // Scale required to reach the header logo size from the hero pose size.
  const flyScale = finalSize / heroSize;

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {visible && (
        <motion.div
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25, ease: "easeOut" } }}
          className="fixed inset-0 z-[1000] bg-white pointer-events-auto flex items-center justify-center"
        >
          <motion.img
            src="/DexDev-Logo-144.png"
            srcSet="/DexDev-Logo-96.png 96w, /DexDev-Logo-144.png 144w"
            alt="DexDev Logo"
            width={heroSize}
            height={heroSize}
            style={{ width: heroSize, height: heroSize }}
            initial={{ scale: 0.9, opacity: 0, filter: "drop-shadow(0 0 0px rgba(255,184,0,0))" }}
            animate={{
              scale: [0.9, 1.15, 1.15, flyScale],
              opacity: [0, 1, 1, 1],
              filter: [
                "drop-shadow(0 0 0px rgba(255,184,0,0))",
                "drop-shadow(0 0 18px rgba(255,184,0,0.55))",
                "drop-shadow(0 0 28px rgba(255,184,0,0.75))",
                "drop-shadow(0 0 6px rgba(255,184,0,0.35))",
              ],
              x: [0, 0, 0, flyX],
              y: [0, 0, 0, flyY],
            }}
            transition={{
              duration: LOADER_DURATION_MS / 1000,
              times: [0, 0.29, 0.57, 1],   // 0s, 0.4s, 0.8s, 1.4s
              ease: ["easeOut", "easeInOut", [0.65, 0, 0.35, 1]],
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
