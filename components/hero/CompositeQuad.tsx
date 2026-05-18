"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { compositeVertex, compositeFragment } from "./shaders";
import type { HeroRefs } from "./types";
import { IMAGE_SIZES, PORTRAIT_HOLD, PORTRAIT_CROSSFADE } from "./types";

interface CompositeQuadProps {
  textures: THREE.Texture[];
  heroRefs: HeroRefs;
}

// Smooth ease-in-out: slow at the start and end of the crossfade, fast in the middle.
const easeInOut = (t: number) => t * t * (3 - 2 * t);

export default function CompositeQuad({ textures, heroRefs }: CompositeQuadProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const elapsedRef = useRef(0);
  const indexRef = useRef(0);

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

    elapsedRef.current += delta;

    // ── Portrait cycle ──
    const cycleDuration = PORTRAIT_HOLD + PORTRAIT_CROSSFADE;
    const cyclesElapsed = elapsedRef.current / cycleDuration;
    const cycleIndex = Math.floor(cyclesElapsed);
    const t = cyclesElapsed - cycleIndex; // 0..1 within current cycle

    if (cycleIndex !== indexRef.current) {
      indexRef.current = cycleIndex;
      const cur = cycleIndex % textures.length;
      const nxt = (cycleIndex + 1) % textures.length;
      mat.uniforms.uCurrentTex.value = textures[cur];
      mat.uniforms.uNextTex.value = textures[nxt];
    }

    // Hold, then ease-in-out crossfade
    const holdRatio = PORTRAIT_HOLD / cycleDuration;
    const fadeRaw = t < holdRatio ? 0 : (t - holdRatio) / (1 - holdRatio);
    mat.uniforms.uFade.value = easeInOut(Math.min(1, Math.max(0, fadeRaw)));

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
