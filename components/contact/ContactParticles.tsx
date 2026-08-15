"use client";

import { useRef, useMemo, useEffect, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { particleVertex } from "@/components/hero/shaders";

/* Higher-opacity variant for white background — same logic, alpha boosted */
const contactParticleFragment = /* glsl */ `
precision highp float;

uniform float uTime;
uniform sampler2D uMaskTex;
uniform float uScrollFade;

varying vec4 vRandom;
varying vec3 vColor;
varying vec2 vScreenUv;

void main() {
  vec2 uv = gl_PointCoord.xy;
  float d = length(uv - vec2(0.5));
  if (d > 0.5) discard;

  vec3 color = vColor + 0.15 * sin(uv.yxx + uTime + vRandom.y * 6.28);

  float alpha = 0.55 + 0.2 * vRandom.x;
  if (alpha < 0.01) discard;

  gl_FragColor = vec4(color, alpha);
}
`;

const COUNT = 200;
const SPREAD = 5;
const SPEED = 0.15;
const BASE_SIZE = 160;
const SIZE_RANDOMNESS = 1;
const COLORS = ["#db8b00", "#c47d00", "#1a1a1a", "#555555"];

const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace(/^#/, "");
  const n = parseInt(h, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

function ParticleMesh() {
  const meshRef = useRef<THREE.Points>(null);

  const { geometry, uniforms, blankTexture } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const randoms = new Float32Array(COUNT * 4);
    const colors = new Float32Array(COUNT * 3);
    const offsets = new Float32Array(COUNT * 2);

    for (let i = 0; i < COUNT; i++) {
      let x: number, y: number, z: number, len: number;
      do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        z = Math.random() * 2 - 1;
        len = x * x + y * y + z * z;
      } while (len > 1 || len === 0);
      const r = Math.cbrt(Math.random());
      positions.set([x * r, y * r, z * r], i * 3);
      randoms.set(
        [Math.random(), Math.random(), Math.random(), Math.random()],
        i * 4,
      );
      const col = hexToRgb(COLORS[Math.floor(Math.random() * COLORS.length)]);
      colors.set(col, i * 3);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 4));
    geo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("aOffset", new THREE.BufferAttribute(offsets, 2));

    const tex = new THREE.DataTexture(
      new Uint8Array([0, 0, 0, 255]),
      1,
      1,
      THREE.RGBAFormat,
    );
    tex.needsUpdate = true;

    const u = {
      uTime: { value: 0 },
      uSpread: { value: SPREAD },
      uBaseSize: { value: BASE_SIZE },
      uSizeRandomness: { value: SIZE_RANDOMNESS },
      uMaskTex: { value: tex },
      uScrollFade: { value: 0 },
    };

    return { geometry: geo, uniforms: u, blankTexture: tex };
  }, []);

  useEffect(() => {
    return () => {
      geometry.dispose();
      blankTexture.dispose();
    };
  }, [geometry, blankTexture]);

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    uniforms.uTime.value = elapsed * SPEED;
    if (meshRef.current) {
      meshRef.current.rotation.y = elapsed * 0.04;
      meshRef.current.rotation.x = Math.sin(elapsed * 0.12) * 0.08;
    }
  });

  return (
    <points ref={meshRef} geometry={geometry} renderOrder={0}>
      <shaderMaterial
        vertexShader={particleVertex}
        fragmentShader={contactParticleFragment}
        uniforms={uniforms}
        transparent
        depthTest={false}
        depthWrite={false}
      />
    </points>
  );
}

export default function ContactParticles() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);

    update();
    mq.addEventListener("change", update);

    return () => mq.removeEventListener("change", update);
  }, []);

  // A continuously drifting full-bleed particle field is decorative motion
  // behind the page's primary CTA — drop it rather than soften it.
  if (reducedMotion) return null;

  return (
    <div className="absolute inset-0" style={{ pointerEvents: "none", zIndex: 0 }} aria-hidden="true">
      <Canvas
        gl={{ antialias: false, alpha: true, stencil: false }}
        camera={{ fov: 15, near: 0.1, far: 100, position: [0, 0, 20] }}
        dpr={[1, 1.5]}
        style={{ width: "100%", height: "100%", pointerEvents: "none", display: "block" }}
        events={undefined}
      >
        <Suspense fallback={null}>
          <ParticleMesh />
        </Suspense>
      </Canvas>
    </div>
  );
}
