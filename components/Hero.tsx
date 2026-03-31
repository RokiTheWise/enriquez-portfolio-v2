"use client";

import { useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

/* ──────────────────────────── Gear background ──────────────────────────── */

const GEAR_PATH =
  "M12 15.5A3.5 3.5 0 0 1 8.5 12 3.5 3.5 0 0 1 12 8.5a3.5 3.5 0 0 1 3.5 3.5 3.5 3.5 0 0 1-3.5 3.5m7.43-2.53c.04-.32.07-.64.07-.97 0-.33-.03-.66-.07-1l2.11-1.63c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.31-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.5.42l-.38 2.65c-.61.25-1.17.58-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64L4.57 11c-.04.34-.07.67-.07 1 0 .33.03.65.07.97l-2.11 1.66c-.19.15-.25.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1.01c.52.4 1.08.73 1.69.98l.38 2.65c.05.24.25.42.5.42h4c.25 0 .46-.18.5-.42l.38-2.65c.61-.25 1.17-.58 1.69-.98l2.49 1.01c.22.08.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64L19.43 12.97Z";

interface GearProps {
  size: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  duration: number;
  direction: "cw" | "ccw";
  opacity?: number;
}

function Gear({
  size,
  top,
  left,
  right,
  bottom,
  duration,
  direction,
  opacity = 0.06,
}: GearProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className="absolute text-zinc-300 pointer-events-none"
      style={{ top, left, right, bottom, opacity }}
      animate={{ rotate: direction === "cw" ? 360 : -360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      <path d={GEAR_PATH} />
    </motion.svg>
  );
}

const gears: GearProps[] = [
  { size: 320, top: "-60px", left: "-80px", duration: 40, direction: "cw" },
  { size: 200, top: "15%", right: "-40px", duration: 30, direction: "ccw", opacity: 0.04 },
  { size: 160, bottom: "10%", left: "5%", duration: 25, direction: "cw", opacity: 0.05 },
  { size: 260, bottom: "-80px", right: "10%", duration: 35, direction: "ccw", opacity: 0.04 },
  { size: 120, top: "40%", left: "25%", duration: 20, direction: "cw", opacity: 0.03 },
];

/* ──────────────────── Frame-buffer feedback reveal ──────────────────── */

// Tuning
const FADE_RATE = 0.04; // per-frame alpha decay — controls trail lifespan (~1.2s to vanish)
const LERP_FACTOR = 0.12; // mouse smoothing — lower = heavier/laggier feel
const MAX_BLOB_RADIUS = 400; // peak blob size in CSS px
const VEL_SCALE = 3.0; // velocity → radius multiplier
const MIN_VEL = 0.5; // ignore micro-movements
const BLOB_SOFT = 0.5; // radial-gradient mid-stop — controls softness
const INTERP_STEP = 4; // px between interpolated blobs (prevents gaps at high speed)
const STRETCH_X = 1.3; // directional ellipse stretch along movement
const STRETCH_Y = 0.85;

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imgContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const feedbackRef = useRef<HTMLCanvasElement | null>(null);
  const bImgRef = useRef<HTMLImageElement | null>(null);
  const rafRef = useRef<number>(0);

  // Raw mouse target + lerped smooth position
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const smoothRef = useRef({ x: -9999, y: -9999, px: -9999, py: -9999 });
  const needsSnapRef = useRef(true);

  const imgBoundsRef = useRef({ x: 0, y: 0, w: 0, h: 0 });

  /* ── Load business image for canvas compositing ── */
  useEffect(() => {
    const img = new window.Image();
    img.src = "/DJ-Business.png";
    img.onload = () => {
      bImgRef.current = img;
    };
  }, []);

  /* ── Canvas setup + resize sync ── */
  useEffect(() => {
    const fb = document.createElement("canvas");
    feedbackRef.current = fb;

    const sync = () => {
      const cv = canvasRef.current;
      const sec = sectionRef.current;
      if (!cv || !sec) return;

      const dpr = window.devicePixelRatio || 1;
      const w = sec.clientWidth;
      const h = sec.clientHeight;

      cv.width = w * dpr;
      cv.height = h * dpr;
      cv.style.width = `${w}px`;
      cv.style.height = `${h}px`;
      fb.width = w * dpr;
      fb.height = h * dpr;
    };

    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);

  /* ── Main animation loop ── */
  useEffect(() => {
    const loop = () => {
      rafRef.current = requestAnimationFrame(loop);

      const cv = canvasRef.current;
      const fb = feedbackRef.current;
      const sec = sectionRef.current;
      const ic = imgContainerRef.current;
      const ctx = cv?.getContext("2d");
      const fbCtx = fb?.getContext("2d");
      const img = bImgRef.current;
      if (!cv || !fb || !ctx || !fbCtx || !sec || !ic) return;

      const dpr = window.devicePixelRatio || 1;
      const raw = mouseRef.current;
      const s = smoothRef.current;

      // Update image bounds live to ensure accuracy
      const sr = sec.getBoundingClientRect();
      const ir = ic.getBoundingClientRect();
      const ib = {
        x: (ir.left - sr.left) * dpr,
        y: (ir.top - sr.top) * dpr,
        w: ir.width * dpr,
        h: ir.height * dpr,
      };

      /* ── Lerp mouse (GSAP-style smooth interpolation) ── */
      if (raw.x > -999) {
        if (needsSnapRef.current) {
          s.x = raw.x * dpr;
          s.y = raw.y * dpr;
          s.px = s.x;
          s.py = s.y;
          needsSnapRef.current = false;
        } else {
          s.x += (raw.x * dpr - s.x) * LERP_FACTOR;
          s.y += (raw.y * dpr - s.y) * LERP_FACTOR;
        }
      }

      /* ── 1. Fade feedback buffer (the "heal") ── */
      fbCtx.globalCompositeOperation = "destination-out";
      fbCtx.fillStyle = `rgba(0,0,0,${FADE_RATE})`;
      fbCtx.fillRect(0, 0, fb.width, fb.height);
      fbCtx.globalCompositeOperation = "source-over";

      /* ── 2. Stamp new blobs along the movement vector ── */
      const dx = s.x - s.px;
      const dy = s.y - s.py;
      const vel = Math.sqrt(dx * dx + dy * dy);

      if (vel > MIN_VEL * dpr && s.x > 0) {
        const angle = Math.atan2(dy, dx);
        const baseR = Math.min(vel * VEL_SCALE, MAX_BLOB_RADIUS * dpr);
        const step = INTERP_STEP * dpr;
        const steps = Math.max(1, Math.floor(vel / step));

        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const bx = s.px + dx * t;
          const by = s.py + dy * t;
          const r = baseR * (0.5 + 0.5 * t); 

          const g = fbCtx.createRadialGradient(bx, by, 0, bx, by, r);
          g.addColorStop(0, "rgba(255,255,255,1)");
          g.addColorStop(BLOB_SOFT, "rgba(255,255,255,0.5)");
          g.addColorStop(1, "rgba(255,255,255,0)");

          fbCtx.save();
          fbCtx.translate(bx, by);
          fbCtx.rotate(angle);
          fbCtx.scale(STRETCH_X, STRETCH_Y); 
          fbCtx.translate(-bx, -by);
          fbCtx.fillStyle = g;
          fbCtx.beginPath();
          fbCtx.arc(bx, by, r, 0, Math.PI * 2);
          fbCtx.fill();
          fbCtx.restore();
        }
      }

      s.px = s.x;
      s.py = s.y;

      /* ── 3. Composite: feedback trail → business image reveal ── */
      ctx.clearRect(0, 0, cv.width, cv.height);

      if (img) {
        ctx.save();
        ctx.drawImage(fb, 0, 0);
        ctx.globalCompositeOperation = "source-in";
        ctx.drawImage(img, ib.x, ib.y, ib.w, ib.h);
        ctx.restore();
      }
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  /* ── Mouse handlers ── */
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current.x = -9999;
    mouseRef.current.y = -9999;
    needsSnapRef.current = true;
  }, []);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-screen overflow-hidden bg-white"
    >
      {/* Rotating gear background */}
      {gears.map((gear, i) => (
        <Gear key={i} {...gear} />
      ))}

      {/* Image A — Casual (always visible) */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div
          ref={imgContainerRef}
          className="relative w-[420px] h-[420px] sm:w-[500px] sm:h-[500px] md:w-[600px] md:h-[600px]"
        >
          <Image
            src="/DJ-Casual.png"
            fill
            alt="Dexter Jethro — Casual"
            className="object-contain"
            priority
            unoptimized
          />
        </div>
      </div>

      {/* Canvas — frame-buffer feedback wave reveal */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-20 pointer-events-none"
      />
    </section>
  );
}
