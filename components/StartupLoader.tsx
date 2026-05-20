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
    0.8 → 1.4s : logo flies to top-left header position

  At 1.4s: white overlay cuts away instantly, page fades in (0.5s).
  The logo stays mounted above both and fades out over that same 0.5s,
  handing off visually to the real header logo underneath.

  Target position matches the hero header logo (HeroHUD.tsx):
    - mobile: px-5 py-4 padding, w-7 (28px) logo  → center at (20+14, 16+14) = (34, 30)
    - desktop: px-12 pt-12, w-12 (48px) logo      → center at (48+24, 48+24) = (72, 72)
*/

const LOADER_DURATION_MS = 1400;
const HANDOFF_DURATION_MS = 500;
const SESSION_KEY = "portfolio_visited";

interface LogoAnim {
  heroSize: number;
  flyX: number;
  flyY: number;
  flyScale: number;
}

export default function StartupLoader({ onComplete }: StartupLoaderProps) {
  const alreadyVisited = typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY) === "1";
  const [overlayVisible, setOverlayVisible] = useState(!alreadyVisited);
  const [logoVisible, setLogoVisible] = useState(!alreadyVisited);
  const [anim, setAnim] = useState<LogoAnim | null>(null);

  useEffect(() => {
    if (alreadyVisited) {
      onComplete?.();
      return;
    }
    sessionStorage.setItem(SESSION_KEY, "1");

    const isMobile = window.innerWidth < 768;
    const heroSize = isMobile ? 96 : 144;

    // Measure the real header logo position from the DOM so we always
    // land exactly on it regardless of viewport or browser chrome.
    const headerLogo = document.querySelector<HTMLImageElement>(
      "img[data-header-logo]"
    );
    let finalCenterX: number;
    let finalCenterY: number;
    let finalSize: number;

    if (headerLogo) {
      const rect = headerLogo.getBoundingClientRect();
      finalCenterX = rect.left + rect.width / 2;
      finalCenterY = rect.top + rect.height / 2;
      finalSize = rect.width;
    } else {
      // Fallback to hardcoded values
      finalSize = isMobile ? 28 : 48;
      finalCenterX = isMobile ? 34 : 72;
      finalCenterY = isMobile ? 30 : 72;
    }

    setAnim({
      heroSize,
      flyX: finalCenterX - window.innerWidth / 2,
      flyY: finalCenterY - window.innerHeight / 2,
      flyScale: finalSize / heroSize,
    });

    const t1 = setTimeout(() => {
      setOverlayVisible(false);
      onComplete?.();
    }, LOADER_DURATION_MS);

    const t2 = setTimeout(() => {
      setLogoVisible(false);
    }, LOADER_DURATION_MS + HANDOFF_DURATION_MS);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* White overlay — cuts away instantly at animation end */}
      <AnimatePresence>
        {overlayVisible && (
          <motion.div
            key="overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 1, transition: { duration: 0 } }}
            className="fixed inset-0 z-[999] bg-white pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Logo — stays above page content, fades out as page fades in */}
      <AnimatePresence>
        {logoVisible && anim && (
          <motion.div
            key="logo"
            className="fixed inset-0 z-[1000] pointer-events-none flex items-center justify-center"
            exit={{ opacity: 0, transition: { duration: HANDOFF_DURATION_MS / 1000, ease: "easeOut" } }}
          >
            <motion.img
              src="/DexDev-Logo-144.png"
              srcSet="/DexDev-Logo-96.png 96w, /DexDev-Logo-144.png 144w"
              alt="DexDev Logo"
              width={anim.heroSize}
              height={anim.heroSize}
              style={{ width: anim.heroSize, height: anim.heroSize }}
              initial={{ scale: 0.9, opacity: 0, filter: "drop-shadow(0 0 0px rgba(255,184,0,0))" }}
              animate={{
                scale: [0.9, 1.15, 1.15, anim.flyScale],
                opacity: [0, 1, 1, 1],
                filter: [
                  "drop-shadow(0 0 0px rgba(255,184,0,0))",
                  "drop-shadow(0 0 18px rgba(255,184,0,0.55))",
                  "drop-shadow(0 0 28px rgba(255,184,0,0.75))",
                  "drop-shadow(0 0 6px rgba(255,184,0,0.35))",
                ],
                x: [0, 0, 0, anim.flyX],
                y: [0, 0, 0, anim.flyY],
              }}
              transition={{
                duration: LOADER_DURATION_MS / 1000,
                times: [0, 0.29, 0.57, 1],
                ease: ["easeOut", "easeInOut", [0.65, 0, 0.35, 1]],
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
