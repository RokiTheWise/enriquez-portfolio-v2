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

  const uniforms = useMemo(
    () => ({
      uCasualTex: { value: casualTex },
      uBusinessTex: { value: businessTex },
      uMaskTex: { value: null as THREE.Texture | null },
      uImageBounds: { value: new THREE.Vector4(0, 0, 1, 1) },
      uTime: { value: 0 },
    }),
    [casualTex, businessTex],
  );

  useFrame((state) => {
    const mat = matRef.current;
    if (!mat) return;

    mat.uniforms.uTime.value = state.clock.elapsedTime;

    // Update mask texture from FBO
    const maskTarget = heroRefs.maskRef.current;
    if (maskTarget) {
      mat.uniforms.uMaskTex.value = maskTarget.texture;
    }

    // Compute image bounds in UV space [0,1]
    const { width, height } = state.size;
    const imageSize =
      width < 640
        ? IMAGE_SIZES.sm
        : width < 768
          ? IMAGE_SIZES.md
          : IMAGE_SIZES.lg;

    const imgW = imageSize / width;
    const imgH = imageSize / height;
    mat.uniforms.uImageBounds.value.set(
      0.5 - imgW / 2, // left
      0.5 - imgH / 2, // bottom
      0.5 + imgW / 2, // right
      0.5 + imgH / 2, // top
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
