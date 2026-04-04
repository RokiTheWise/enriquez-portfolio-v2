"use client";

import { useRef, useCallback, Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import Particles from "./hero/Particles";
import BrushStrokeMask from "./hero/BrushStrokeMask";
import CompositeQuad from "./hero/CompositeQuad";
import HeroHUD from "./hero/HeroHUD";
import type { HeroRefs } from "./hero/types";
import { TRAIL_LENGTH, CAMERA_FOV, CAMERA_DISTANCE } from "./hero/types";

function HeroScene({ heroRefs }: { heroRefs: HeroRefs }) {
  const [casualTex, businessTex] = useTexture([
    "/DJ-Casual.png",
    "/DJ-Business.png",
  ]);

  return (
    <>
      <Particles heroRefs={heroRefs} />
      <BrushStrokeMask heroRefs={heroRefs} />
      <CompositeQuad
        casualTex={casualTex}
        businessTex={businessTex}
        heroRefs={heroRefs}
      />
    </>
  );
}

interface HeroProps {
  scrollProgressRef: React.MutableRefObject<number>;
}

export default function Hero({ scrollProgressRef }: HeroProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  const heroRefs: HeroRefs = useMemo(
    () => ({
      mouseRef: { current: { x: -9999, y: -9999 } },
      trailRef: {
        current: Array.from({ length: TRAIL_LENGTH }, () => ({
          x: -9999,
          y: -9999,
          prevX: -9999,
          prevY: -9999,
          velocity: 0,
          width: 0,
        })),
      },
      maskRef: { current: null },
      hasEnteredRef: { current: false },
      scrollProgressRef,
    }),
    [scrollProgressRef],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      heroRefs.mouseRef.current.x = x;
      heroRefs.mouseRef.current.y = y;

      if (!heroRefs.hasEnteredRef.current) {
        heroRefs.hasEnteredRef.current = true;
        // Snap all trail points to current mouse position
        const trail = heroRefs.trailRef.current;
        for (let i = 0; i < trail.length; i++) {
          trail[i].x = x;
          trail[i].y = y;
          trail[i].prevX = x;
          trail[i].prevY = y;
        }
      }
    },
    [heroRefs],
  );

  const handleMouseLeave = useCallback(() => {
    heroRefs.mouseRef.current.x = -9999;
    heroRefs.mouseRef.current.y = -9999;
    heroRefs.hasEnteredRef.current = false;
  }, [heroRefs]);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-screen overflow-hidden bg-white"
    >
      <Canvas
        gl={{ antialias: false, alpha: false, stencil: false }}
        camera={{
          fov: CAMERA_FOV,
          near: 0.1,
          far: 100,
          position: [0, 0, CAMERA_DISTANCE],
        }}
        dpr={[1, 2]}
        style={{ position: "absolute", inset: 0 }}
      >
        <color attach="background" args={["#ffffff"]} />
        <Suspense fallback={null}>
          <HeroScene heroRefs={heroRefs} />
        </Suspense>
      </Canvas>
      <HeroHUD />
    </section>
  );
}
