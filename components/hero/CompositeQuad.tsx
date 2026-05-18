"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { compositeVertex, compositeFragment } from "./shaders";
import type { HeroRefs } from "./types";
import { IMAGE_SIZES, PORTRAIT_CROSSFADE, PORTRAIT_CYCLE_GRACE_S } from "./types";

interface CompositeQuadProps {
  textures: THREE.Texture[];
  heroRefs: HeroRefs;
}

// Smooth ease-in-out: slow at the start and end of the crossfade, fast in the middle.
const easeInOut = (t: number) => t * t * (3 - 2 * t);

export default function CompositeQuad({ textures, heroRefs }: CompositeQuadProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  // Index of the photo currently fully visible (uCurrentTex slot).
  const photoIndexRef = useRef(0);
  // Last cycle-signal value we observed from HeroHUD. Latched lazily on the
  // first frame.
  const lastSignalRef = useRef<number | null>(null);
  // Wall-clock age (seconds) since this component mounted. The first
  // adjective is already mid-typing when we mount, so we ignore any cycle
  // signals that fire before this expires — DJ1 stays paired with the first
  // adjective regardless of StrictMode double-mounts or other timing noise.
  const ageRef = useRef(0);
  // Crossfade progress in seconds. -1 means "no fade in progress".
  const fadeElapsedRef = useRef(-1);

  const uniforms = useMemo(
    () => ({
      uCurrentTex: { value: textures[0] },
      uNextTex: { value: textures[1 % textures.length] },
      uImageBounds: { value: new THREE.Vector4(0, 0, 1, 1) },
      uFade: { value: 0 },
      uPortraitFade: { value: 0 },
    }),
    [textures],
  );

  useFrame((state, delta) => {
    const mat = matRef.current;
    if (!mat) return;

    // ── Event-driven portrait cycle ──
    // Each bump of cycleSignalRef kicks off a single PORTRAIT_CROSSFADE-second
    // ease-in-out blend. Signals received during the startup grace period
    // are absorbed so DJ1 stays paired with the first adjective.
    ageRef.current += delta;
    const signal = heroRefs.cycleSignalRef.current;
    if (lastSignalRef.current === null || ageRef.current < PORTRAIT_CYCLE_GRACE_S) {
      // Latch onto whatever's there — ignore any pre-grace bumps.
      lastSignalRef.current = signal;
    } else if (signal !== lastSignalRef.current && fadeElapsedRef.current < 0) {
      lastSignalRef.current = signal;
      fadeElapsedRef.current = 0;
      const nxt = (photoIndexRef.current + 1) % textures.length;
      mat.uniforms.uNextTex.value = textures[nxt];
    }

    if (fadeElapsedRef.current >= 0) {
      fadeElapsedRef.current += delta;
      const t = Math.min(1, fadeElapsedRef.current / PORTRAIT_CROSSFADE);
      mat.uniforms.uFade.value = easeInOut(t);
      if (t >= 1) {
        // Promote next → current and reset the blend.
        photoIndexRef.current = (photoIndexRef.current + 1) % textures.length;
        mat.uniforms.uCurrentTex.value = textures[photoIndexRef.current];
        mat.uniforms.uFade.value = 0;
        fadeElapsedRef.current = -1;
      }
    }

    // ── Scroll-driven dissolve ──
    const scrollP = heroRefs.scrollProgressRef.current;
    mat.uniforms.uPortraitFade.value = Math.max(
      0,
      Math.min(1, (scrollP - 0.3) / 0.2),
    );

    // ── Image bounds in UV space ──
    const { width, height } = state.size;
    const imageSize =
      width < 640 ? IMAGE_SIZES.sm : width < 768 ? IMAGE_SIZES.md : IMAGE_SIZES.lg;

    const isMobile = width < 768;
    const mobileScale = isMobile ? 1.1 : 1.0;
    const scaledSize = imageSize * mobileScale;

    const imgW = scaledSize / width;
    const imgH = scaledSize / height;
    const yOffset = isMobile ? 0.04 : 0.0;

    // Gentle scroll zoom (+20% max)
    const portraitZoom = 1.0 + scrollP * 0.2;
    const zW = imgW * portraitZoom;
    const zH = imgH * portraitZoom;

    mat.uniforms.uImageBounds.value.set(
      0.5 - zW / 2,
      yOffset,
      0.5 + zW / 2,
      yOffset + zH,
    );
  });

  return (
    <mesh renderOrder={1}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={compositeVertex}
        fragmentShader={compositeFragment}
        uniforms={uniforms}
        transparent
        depthTest={false}
        depthWrite={false}
      />
    </mesh>
  );
}
