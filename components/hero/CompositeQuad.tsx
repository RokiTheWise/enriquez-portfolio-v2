"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { compositeVertex, compositeFragment } from "./shaders";
import type { HeroRefs } from "./types";
import { IMAGE_SIZES } from "./types";

interface CompositeQuadProps {
  casualTex: THREE.Texture;
  businessTex: THREE.Texture;
  heroRefs: HeroRefs;
}

export default function CompositeQuad({
  casualTex,
  businessTex,
  heroRefs,
}: CompositeQuadProps) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const elapsedRef = useRef(0);

  // 1×1 black texture prevents first-frame flash (Three.js defaults null samplers to white)
  const blackTex = useMemo(() => {
    const t = new THREE.DataTexture(
      new Uint8Array([0, 0, 0, 255]),
      1,
      1,
      THREE.RGBAFormat,
    );
    t.needsUpdate = true;
    return t;
  }, []);

  const uniforms = useMemo(
    () => ({
      uCasualTex: { value: casualTex },
      uBusinessTex: { value: businessTex },
      uMaskTex: { value: blackTex },
      uImageBounds: { value: new THREE.Vector4(0, 0, 1, 1) },
      uTime: { value: 0 },
      uScrollWipe: { value: 0 },
    }),
    [casualTex, businessTex, blackTex],
  );

  useFrame((state, delta) => {
    const mat = matRef.current;
    if (!mat) return;

    elapsedRef.current += delta;
    mat.uniforms.uTime.value = elapsedRef.current;

    // Update mask texture from FBO
    const maskTarget = heroRefs.maskRef.current;
    if (maskTarget) {
      mat.uniforms.uMaskTex.value = maskTarget.texture;
    }

    // Scroll progress
    const scrollP = heroRefs.scrollProgressRef.current;

    // Scroll wipe overlay: 0.25→0.7 scroll maps to 0→1
    mat.uniforms.uScrollWipe.value =
      Math.max(0, Math.min(1, (scrollP - 0.25) / 0.45));

    // Compute image bounds in UV space [0,1]
    const { width, height } = state.size;
    const imageSize =
      width < 640
        ? IMAGE_SIZES.sm
        : width < 768
          ? IMAGE_SIZES.md
          : IMAGE_SIZES.lg;

    const isMobile = width < 768;
    const mobileScale = isMobile ? 1.1 : 1.0;
    const scaledSize = imageSize * mobileScale;

    const imgW = scaledSize / width;
    const imgH = scaledSize / height;

    const yOffset = isMobile ? 0.04 : 0.0;

    // ── Z-axis tunnel zoom (portrait depth = 0.4) ──
    const portraitZoom = 1.0 + scrollP * 1.2;
    const zW = imgW * portraitZoom;
    const zH = imgH * portraitZoom;
    // Parallax Y drift at 0.4 factor
    const parallaxY = scrollP * 0.12;

    mat.uniforms.uImageBounds.value.set(
      0.5 - zW / 2,
      yOffset + parallaxY,
      0.5 + zW / 2,
      yOffset + parallaxY + zH
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
