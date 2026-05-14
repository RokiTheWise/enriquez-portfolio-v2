"use client";

import { useRef, useMemo, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { particleVertex, particleFragment } from "@/components/hero/shaders";

const COUNT = 220;
const SPREAD = 5;
const SPEED = 0.15;
const BASE_SIZE = 120;
const SIZE_RANDOMNESS = 1;
const COLORS = ["#db8b00", "#000000", "#ffffff"];

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
        fragmentShader={particleFragment}
        uniforms={uniforms}
        transparent
        depthTest={false}
        depthWrite={false}
      />
    </points>
  );
}

export default function ContactParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      <Canvas
        gl={{ antialias: false, alpha: true, stencil: false }}
        camera={{ fov: 15, near: 0.1, far: 100, position: [0, 0, 20] }}
        dpr={[1, 1.5]}
        style={{ width: "100%", height: "100%", pointerEvents: "none" }}
        events={undefined}
      >
        <Suspense fallback={null}>
          <ParticleMesh />
        </Suspense>
      </Canvas>
    </div>
  );
}
