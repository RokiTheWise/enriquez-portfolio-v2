"use client";

import { useRef, useCallback, Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import type { MotionValue } from "framer-motion";
import Particles from "./hero/Particles";
import CompositeQuad from "./hero/CompositeQuad";
import HeroHUD from "./hero/HeroHUD";
import type { HeroRefs } from "./hero/types";
import { CAMERA_FOV, CAMERA_DISTANCE } from "./hero/types";

const PORTRAIT_SRCS = [
  "/DJ1.webp",
  "/DJ2.webp",
  "/DJ3.webp",
  "/DJ4.webp",
  "/DJ5.webp",
];

function HeroScene({ heroRefs }: { heroRefs: HeroRefs }) {
  const textures = useTexture(PORTRAIT_SRCS);

  return (
    <>
      <Particles heroRefs={heroRefs} />
      <CompositeQuad textures={textures} heroRefs={heroRefs} />
    </>
  );
}

interface HeroProps {
  scrollProgressRef: React.MutableRefObject<number>;
  scrollYProgress: MotionValue<number>;
}

export default function Hero({ scrollProgressRef, scrollYProgress }: HeroProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  const heroRefs: HeroRefs = useMemo(
    () => ({
      mouseRef: { current: { x: 0, y: 0, active: false } },
      scrollProgressRef,
    }),
    [scrollProgressRef],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      heroRefs.mouseRef.current.x = e.clientX - rect.left;
      heroRefs.mouseRef.current.y = e.clientY - rect.top;
      heroRefs.mouseRef.current.active = true;
    },
    [heroRefs],
  );

  const handleMouseLeave = useCallback(() => {
    heroRefs.mouseRef.current.active = false;
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
      <HeroHUD scrollYProgress={scrollYProgress} />
    </section>
  );
}
