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
  REPULSION_STRENGTH,
  REPULSION_RADIUS_SCALE,
  REPULSION_MIN_WORLD_RADIUS,
  WAKE_STRENGTH,
  CAMERA_FOV,
  CAMERA_DISTANCE,
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
  const elapsedRef = useRef(0);

  const { geometry, uniforms, trailUniformArray, trailVelArray } = useMemo(() => {
    const count = PARTICLE_COUNT;
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count * 4);
    const colors = new Float32Array(count * 3);
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
      randoms.set(
        [Math.random(), Math.random(), Math.random(), Math.random()],
        i * 4,
      );
      const col = hexToRgb(palette[Math.floor(Math.random() * palette.length)]);
      colors.set(col, i * 3);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 4));
    geo.setAttribute("aColor", new THREE.BufferAttribute(colors, 3));

    // Pre-allocate trail uniform arrays
    const trailArr = Array.from(
      { length: TRAIL_LENGTH },
      () => new THREE.Vector3(0, 0, 0),
    );
    const trailVelArr = Array.from(
      { length: TRAIL_LENGTH },
      () => new THREE.Vector2(0, 0),
    );

    const u = {
      uTime: { value: 0 },
      uSpread: { value: PARTICLE_SPREAD },
      uBaseSize: { value: PARTICLE_BASE_SIZE },
      uSizeRandomness: { value: PARTICLE_SIZE_RANDOMNESS },
      uTrailPoints: { value: trailArr },
      uTrailVelocities: { value: trailVelArr },
      uRepulsionStrength: { value: REPULSION_STRENGTH },
      uWakeStrength: { value: WAKE_STRENGTH },
    };

    return {
      geometry: geo,
      uniforms: u,
      trailUniformArray: trailArr,
      trailVelArray: trailVelArr,
    };
  }, []);

  useFrame((state, delta) => {
    elapsedRef.current += delta * PARTICLE_SPEED * 1000;
    uniforms.uTime.value = elapsedRef.current * 0.001;

    const mesh = meshRef.current;
    if (!mesh) return;

    // Rotation (preserved from OGL version)
    mesh.rotation.x = Math.sin(elapsedRef.current * 0.0002) * 0.1;
    mesh.rotation.y = Math.cos(elapsedRef.current * 0.0005) * 0.15;
    mesh.rotation.z += 0.01 * PARTICLE_SPEED;

    // Update trail repulsion points in world space
    const trail = heroRefs.trailRef.current;
    const camera = state.camera as THREE.PerspectiveCamera;
    const vFOV = (CAMERA_FOV * Math.PI) / 180;
    const halfH = Math.tan(vFOV / 2) * CAMERA_DISTANCE;
    const halfW = halfH * camera.aspect;
    const { width, height } = state.size;

    for (let i = 0; i < TRAIL_LENGTH; i++) {
      const pt = trail[i];
      if (pt) {
        // Convert pixel coords to world space
        const worldX = ((pt.x / width) * 2 - 1) * halfW;
        const worldY = -((pt.y / height) * 2 - 1) * halfH;
        const baseRadius =
          (pt.width / Math.min(width, height)) * 2 * halfH * REPULSION_RADIUS_SCALE;
        const worldRadius = Math.max(REPULSION_MIN_WORLD_RADIUS, baseRadius);
        trailUniformArray[i].set(worldX, worldY, worldRadius);

        // Pixel velocity → world-space velocity vector
        const velPxX = pt.x - pt.prevX;
        const velPxY = pt.y - pt.prevY;
        const worldVelX = (velPxX / width) * 2 * halfW;
        const worldVelY = -(velPxY / height) * 2 * halfH;
        trailVelArray[i].set(worldVelX, worldVelY);
      } else {
        trailUniformArray[i].set(0, 0, 0);
        trailVelArray[i].set(0, 0);
      }
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
