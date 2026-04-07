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
  TRAIL_LENGTH,
  CAMERA_FOV,
  CAMERA_DISTANCE,
  DAMPING,
  RETURN_FORCE,
  REPULSION_STRENGTH,
  REPULSION_RADIUS_SCALE,
  REPULSION_MIN_WORLD_RADIUS,
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
  const timer = useMemo(() => new THREE.Timer(), []);

  const { geometry, uniforms, offsets, velocities, randoms } = useMemo(() => {
    const count = PARTICLE_COUNT;
    const positions = new Float32Array(count * 3);
    const randomsArr = new Float32Array(count * 4);
    const colors = new Float32Array(count * 3);
    const offsetArr = new Float32Array(count * 2); // xy displacement
    const velArr = new Float32Array(count * 2); // xy velocity
    const palette = PARTICLE_COLORS;

    for (let i = 0; i < count; i++) {
      // Sphere distribution (rejection sampling)
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
      const col = hexToRgb(
        palette[Math.floor(Math.random() * palette.length)],
      );
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
      uMaskTex: { value: null as THREE.Texture | null },
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
    // THREE.Timer for precise, non-deprecated timing
    timer.update();
    const dt = Math.min(timer.getDelta(), 0.05); // cap at 50ms
    const elapsed = timer.getElapsed();

    uniforms.uTime.value = elapsed * PARTICLE_SPEED;

    // Update mask texture for GPU opacity sampling
    const maskTarget = heroRefs.maskRef.current;
    if (maskTarget) {
      uniforms.uMaskTex.value = maskTarget.texture;
    }

    // Elegant particle exit: fade opacity from 0.85 → 1.0 scroll
    const scroll = heroRefs.scrollProgressRef.current;
    uniforms.uScrollFade.value = Math.max(0, Math.min(1, (scroll - 0.85) / 0.15));

    const mesh = meshRef.current;
    if (!mesh) return;

    // Gentle rotation
    mesh.rotation.x = Math.sin(elapsed * 0.2) * 0.1;
    mesh.rotation.y = Math.cos(elapsed * 0.5) * 0.15;
    mesh.rotation.z += 0.01 * PARTICLE_SPEED * dt * 60;

    // ── CPU-side viscous fluid physics ──
    const trail = heroRefs.trailRef.current;
    const camera = state.camera as THREE.PerspectiveCamera;
    const vFOV = (CAMERA_FOV * Math.PI) / 180;
    const halfH = Math.tan(vFOV / 2) * CAMERA_DISTANCE;
    const halfW = halfH * camera.aspect;
    const { width, height } = state.size;

    // Convert trail points to world space
    const trailWorld: {
      x: number;
      y: number;
      radius: number;
      vx: number;
      vy: number;
    }[] = [];
    for (let i = 0; i < TRAIL_LENGTH; i++) {
      const pt = trail[i];
      if (pt && pt.x > -999) {
        const wx = ((pt.x / width) * 2 - 1) * halfW;
        const wy = -((pt.y / height) * 2 - 1) * halfH;
        const baseRadius =
          (pt.width / Math.min(width, height)) *
          2 *
          halfH *
          REPULSION_RADIUS_SCALE;
        const radius = Math.max(REPULSION_MIN_WORLD_RADIUS, baseRadius);
        const vx = ((pt.x - pt.prevX) / width) * 2 * halfW;
        const vy = -((pt.y - pt.prevY) / height) * 2 * halfH;
        trailWorld.push({ x: wx, y: wy, radius, vx, vy });
      }
    }

    const dtScale = dt * 60; // normalize to 60fps
    const positions = geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Compute animated world position (home + sine)
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

      // Forces from trail points
      for (const tp of trailWorld) {
        const dx = px - tp.x;
        const dy = py - tp.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < tp.radius && dist > 0.001) {
          const nx = dx / dist;
          const ny = dy / dist;
          const force = 1 - dist / tp.radius;
          const cubicForce = force * force * force;

          // Radial repulsion
          accelX += nx * cubicForce * REPULSION_STRENGTH;
          accelY += ny * cubicForce * REPULSION_STRENGTH;

          // Exponential bow-wave: particles ahead of cursor get pushed forward
          const speed = Math.sqrt(tp.vx * tp.vx + tp.vy * tp.vy);
          if (speed > 0.0001) {
            const vnx = tp.vx / speed;
            const vny = tp.vy / speed;
            const ahead = nx * vnx + ny * vny; // dot: >0 = in front
            const bowWave = Math.exp(ahead * 2.0) - 1.0;
            const normalizedSpeed = Math.min(speed * 12.0, 1.0);
            accelX +=
              vnx *
              cubicForce *
              bowWave *
              normalizedSpeed *
              BOW_WAVE_STRENGTH;
            accelY +=
              vny *
              cubicForce *
              bowWave *
              normalizedSpeed *
              BOW_WAVE_STRENGTH;
          }
        }
      }

      // Viscous return to origin (spring force)
      accelX -= offsets[i * 2] * RETURN_FORCE;
      accelY -= offsets[i * 2 + 1] * RETURN_FORCE;

      // Acceleration → Velocity (with damping 0.92)
      velocities[i * 2] =
        (velocities[i * 2] + accelX * dtScale) * DAMPING;
      velocities[i * 2 + 1] =
        (velocities[i * 2 + 1] + accelY * dtScale) * DAMPING;

      // Velocity → Position
      offsets[i * 2] += velocities[i * 2] * dtScale;
      offsets[i * 2 + 1] += velocities[i * 2 + 1] * dtScale;
    }

    // Upload displacement attribute to GPU
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
