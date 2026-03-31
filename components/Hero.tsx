"use client";

import { useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Particles from "./Particles";

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
      {/* Particles background */}
      <div className="absolute inset-0 pointer-events-none">
        <Particles
          particleCount={460}
          particleSpread={5}
          speed={0.19}
          particleColors={["#db8b00", "#000000", "#ffffff"]}
          moveParticlesOnHover
          particleHoverFactor={1}
          alphaParticles={false}
          particleBaseSize={100}
          sizeRandomness={1}
          cameraDistance={20}
          disableRotation={false}
        />
      </div>

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
