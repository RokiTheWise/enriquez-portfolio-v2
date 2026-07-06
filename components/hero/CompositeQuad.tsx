"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { compositeVertex, compositeFragment } from "./shaders";
import type { HeroRefs } from "./types";
import { IMAGE_SIZES } from "./types";

interface CompositeQuadProps {
  texture: THREE.Texture;
  heroRefs: HeroRefs;
}

export default function CompositeQuad({ texture, heroRefs }: CompositeQuadProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTex: { value: texture },
      uImageBounds: { value: new THREE.Vector4(0, 0, 1, 1) },
      uPortraitFade: { value: 0 },
    }),
    [texture],
  );

  useFrame((state) => {
    const mat = matRef.current;
    if (!mat) return;

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
    const imgW = imageSize / width;
    const imgH = imageSize / height;
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
