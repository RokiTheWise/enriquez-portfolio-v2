"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { particleVertex, particleFragment } from "./shaders";
import type { HeroRefs } from "./types";
import {
  PARTICLE_COUNT,
  PARTICLE_SPREAD,
  PARTICLE_SPEED,
  PARTICLE_BASE_SIZE,
  PARTICLE_SIZE_RANDOMNESS,
  PARTICLE_COLORS,
  CAMERA_FOV,
  CAMERA_DISTANCE,
  DAMPING,
  RETURN_FORCE,
  REPULSION_STRENGTH,
  REPULSION_RADIUS_WORLD,
  BOW_WAVE_STRENGTH,
} from "./types";

const hexToRgb = (hex: string): [number, number, number] => {
  const h = hex.replace(/^#/, "");
  const n = parseInt(h, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
};

interface ParticlesProps {
  heroRefs: HeroRefs;
}

export default function Particles({ heroRefs }: ParticlesProps) {
  const meshRef = useRef<THREE.Points>(null);
  const clock = useMemo(() => new THREE.Clock(), []);

  /*
   * Reduced motion keeps the particle field — it is the hero's identity — but
   * freezes its drift and cursor repulsion, so it reads as a static composition
   * rather than a continuously moving background.
   */
  const reducedMotion = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  // Cursor position in world space, with smoothed velocity for the bow wave.
  const cursorRef = useRef({
    x: 0,
    y: 0,
    px: 0,
    py: 0,
    vx: 0,
    vy: 0,
    active: false,
  });

  const { geometry, uniforms, offsets, velocities, randoms } = useMemo(() => {
    const count = PARTICLE_COUNT;
    const positions = new Float32Array(count * 3);
    const randomsArr = new Float32Array(count * 4);
    const colors = new Float32Array(count * 3);
    const offsetArr = new Float32Array(count * 2);
    const velArr = new Float32Array(count * 2);
    const palette = PARTICLE_COLORS;

    for (let i = 0; i < count; i++) {
      let x: number, y: number, z: number, len: number;
      do {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;
        z = Math.random() * 2 - 1;
        len = x * x + y * y + z * z;
      } while (len > 1 || len === 0);
      const r = Math.cbrt(Math.random());
      positions.set([x * r, y * r, z * r], i * 3);
      randomsArr.set(
        [Math.random(), Math.random(), Math.random(), Math.random()],
        i * 4,
      );
      const col = hexToRgb(palette[Math.floor(Math.random() * palette.length)]);
      colors.set(col, i * 3);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aRandom", new THREE.BufferAttribute(randomsArr, 4));
    geo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));
    geo.setAttribute("aOffset", new THREE.BufferAttribute(offsetArr, 2));

    const u = {
      uTime: { value: 0 },
      uSpread: { value: PARTICLE_SPREAD },
      uBaseSize: { value: PARTICLE_BASE_SIZE },
      uSizeRandomness: { value: PARTICLE_SIZE_RANDOMNESS },
      uScrollFade: { value: 0 },
    };

    return {
      geometry: geo,
      uniforms: u,
      offsets: offsetArr,
      velocities: velArr,
      randoms: randomsArr,
    };
  }, []);

  useFrame((state) => {
    const dt = Math.min(clock.getDelta(), 0.05);
    const elapsed = clock.getElapsedTime();

    // Scroll-linked fade stays — it tracks the user's own input rather than
    // playing on its own — but the time-driven drift is pinned to frame 0.
    const scroll = heroRefs.scrollProgressRef.current;
    uniforms.uScrollFade.value = Math.max(0, Math.min(1, (scroll - 0.5) / 0.3));

    if (reducedMotion) {
      uniforms.uTime.value = 0;
      return;
    }

    uniforms.uTime.value = elapsed * PARTICLE_SPEED;

    const mesh = meshRef.current;
    if (!mesh) return;

    mesh.rotation.x = Math.sin(elapsed * 0.2) * 0.1;
    mesh.rotation.y = Math.cos(elapsed * 0.5) * 0.15;
    mesh.rotation.z += 0.01 * PARTICLE_SPEED * dt * 60;

    // ── Convert cursor pixel coords to world space ──
    const camera = state.camera as THREE.PerspectiveCamera;
    const vFOV = (CAMERA_FOV * Math.PI) / 180;
    const halfH = Math.tan(vFOV / 2) * CAMERA_DISTANCE;
    const halfW = halfH * camera.aspect;
    const { width, height } = state.size;

    const mouse = heroRefs.mouseRef.current;
    const cur = cursorRef.current;

    if (mouse.active) {
      const wx = (mouse.x / width) * 2 * halfW - halfW;
      const wy = -((mouse.y / height) * 2 * halfH - halfH);
      if (!cur.active) {
        cur.x = wx;
        cur.y = wy;
        cur.px = wx;
        cur.py = wy;
        cur.active = true;
      }
      cur.px = cur.x;
      cur.py = cur.y;
      cur.x = wx;
      cur.y = wy;
      cur.vx = cur.x - cur.px;
      cur.vy = cur.y - cur.py;
    } else {
      cur.active = false;
    }

    const radius = REPULSION_RADIUS_WORLD;
    const dtScale = dt * 60;

    const positions = geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const hx = positions[i * 3] * PARTICLE_SPREAD;
      const hy = positions[i * 3 + 1] * PARTICLE_SPREAD;
      const rx = randoms[i * 4];
      const ry = randoms[i * 4 + 1];
      const rz = randoms[i * 4 + 2];
      const rw = randoms[i * 4 + 3];

      const t = elapsed * PARTICLE_SPEED;
      const animX = hx + Math.sin(t * rz + 6.28 * rw) * (0.1 + 1.4 * rx);
      const animY = hy + Math.sin(t * ry + 6.28 * rx) * (0.1 + 1.4 * rw);

      const px = animX + offsets[i * 2];
      const py = animY + offsets[i * 2 + 1];

      let accelX = 0;
      let accelY = 0;

      if (cur.active) {
        const dx = px - cur.x;
        const dy = py - cur.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < radius && dist > 0.001) {
          const nx = dx / dist;
          const ny = dy / dist;
          const force = 1 - dist / radius;
          const cubicForce = force * force * force;

          accelX += nx * cubicForce * REPULSION_STRENGTH;
          accelY += ny * cubicForce * REPULSION_STRENGTH;

          // Bow wave: particles in front of the cursor get pushed along its direction
          const speed = Math.sqrt(cur.vx * cur.vx + cur.vy * cur.vy);
          if (speed > 0.0001) {
            const vnx = cur.vx / speed;
            const vny = cur.vy / speed;
            const ahead = nx * vnx + ny * vny;
            const bowWave = Math.exp(ahead * 2.0) - 1.0;
            const normalizedSpeed = Math.min(speed * 12.0, 1.0);
            accelX += vnx * cubicForce * bowWave * normalizedSpeed * BOW_WAVE_STRENGTH;
            accelY += vny * cubicForce * bowWave * normalizedSpeed * BOW_WAVE_STRENGTH;
          }
        }
      }

      accelX -= offsets[i * 2] * RETURN_FORCE;
      accelY -= offsets[i * 2 + 1] * RETURN_FORCE;

      velocities[i * 2] = (velocities[i * 2] + accelX * dtScale) * DAMPING;
      velocities[i * 2 + 1] =
        (velocities[i * 2 + 1] + accelY * dtScale) * DAMPING;

      offsets[i * 2] += velocities[i * 2] * dtScale;
      offsets[i * 2 + 1] += velocities[i * 2 + 1] * dtScale;
    }

    (geometry.attributes.aOffset as THREE.BufferAttribute).needsUpdate = true;
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
