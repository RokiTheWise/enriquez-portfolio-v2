"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface StartupLoaderProps {
  onComplete?: () => void;
}

/*
  Center fade-out intro across ~2.0s:
    0.0 → 0.5s : logo + glow bloom in
    0.5 → 1.3s : hold with subtle glow pulse
    1.3 → 2.0s : white overlay fades out, logo fades out in place,
                 page fades in beneath

  No movement, no DOM measurement, no alignment edge cases. The logo
  appears, sits, disappears.
*/

const PHASE1_MS = 500;
const PHASE2_MS = 800;
const PHASE3_MS = 700;
const TOTAL_MS = PHASE1_MS + PHASE2_MS + PHASE3_MS;
const SESSION_KEY = "portfolio_visited";

export default function StartupLoader({ onComplete }: StartupLoaderProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const alreadyVisited = sessionStorage.getItem(SESSION_KEY) === "1";
    if (alreadyVisited) {
      setVisible(false);
      onComplete?.();
      return;
    }
    sessionStorage.setItem(SESSION_KEY, "1");

    const t = setTimeout(() => {
      setVisible(false);
      onComplete?.();
    }, TOTAL_MS);

    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;

  const phase1End = PHASE1_MS / TOTAL_MS;
  const phase2End = (PHASE1_MS + PHASE2_MS) / TOTAL_MS;

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        className="fixed inset-0 z-[1000] pointer-events-none flex flex-col items-center justify-center gap-6 md:gap-8 bg-white"
        initial={{ opacity: 1 }}
        animate={{ opacity: [1, 1, 0] }}
        transition={{
          duration: TOTAL_MS / 1000,
          times: [0, phase2End, 1],
          ease: "easeInOut",
        }}
      >
        <motion.img
          src="/DexDev-Logo-144.png"
          srcSet="/DexDev-Logo-96.png 96w, /DexDev-Logo-144.png 144w"
          alt="Dexter Jethro Enriquez"
          width={144}
          height={144}
          className="w-24 h-24 md:w-36 md:h-36"
          initial={{
            scale: 0.9,
            opacity: 0,
            filter: "drop-shadow(0 0 0px rgba(255,184,0,0))",
          }}
          animate={{
            scale: [0.9, 1.15, 1.15, 1.15],
            opacity: [0, 1, 1, 0],
            filter: [
              "drop-shadow(0 0 0px rgba(255,184,0,0))",
              "drop-shadow(0 0 18px rgba(255,184,0,0.55))",
              "drop-shadow(0 0 28px rgba(255,184,0,0.75))",
              "drop-shadow(0 0 0px rgba(255,184,0,0))",
            ],
          }}
          transition={{
            duration: TOTAL_MS / 1000,
            times: [0, phase1End, phase2End, 1],
            ease: ["easeOut", "easeInOut", "easeIn"],
          }}
        />

        {/* Loading bar */}
        <motion.div
          className="w-40 md:w-56 h-[2px] bg-black/10 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{
            duration: TOTAL_MS / 1000,
            times: [0, phase1End, phase2End, 1],
            ease: ["easeOut", "linear", "easeIn"],
          }}
        >
          <motion.div
            className="h-full"
            style={{ backgroundColor: "#FFB800", transformOrigin: "left" }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{
              duration: (PHASE1_MS + PHASE2_MS) / 1000,
              ease: [0.65, 0, 0.35, 1],
            }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
