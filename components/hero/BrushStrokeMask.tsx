"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useFBO } from "@react-three/drei";
import { fullscreenVertex, maskFragment } from "./shaders";
import type { HeroRefs } from "./types";
import {
  TRAIL_LENGTH,
  HEAD_LERP,
  TAIL_LERP,
  MIN_RIBBON_HALF_WIDTH,
  MAX_RIBBON_HALF_WIDTH,
  VEL_SCALE,
  FADE_FACTOR,
  METABALL_BASE_RADIUS,
  METABALL_VEL_RADIUS,
} from "./types";

interface BrushStrokeMaskProps {
  heroRefs: HeroRefs;
}

export default function BrushStrokeMask({ heroRefs }: BrushStrokeMaskProps) {
  const { gl } = useThree();
  const timeRef = useRef(0);
  const pingRef = useRef(0); // 0 = read A write B, 1 = read B write A

  // Two FBOs for ping-pong
  const fboA = useFBO({
    stencilBuffer: false,
    depthBuffer: false,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: THREE.UnsignedByteType,
  });
  const fboB = useFBO({
    stencilBuffer: false,
    depthBuffer: false,
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: THREE.UnsignedByteType,
  });

  // Single offscreen scene: combined decay + metaball field
  const { maskScene, maskMaterial, clipCamera, scratchColor } = useMemo(() => {
    const clipCam = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);

    const pointsArr = Array.from(
      { length: TRAIL_LENGTH },
      () => new THREE.Vector3(0, 0, 0),
    );
    const intensitiesArr = new Array<number>(TRAIL_LENGTH).fill(0);

    const mat = new THREE.ShaderMaterial({
      vertexShader: fullscreenVertex,
      fragmentShader: maskFragment,
      uniforms: {
        uPrevFrame: { value: null },
        uDecay: { value: FADE_FACTOR },
        uResolution: { value: new THREE.Vector2() },
        uPoints: { value: pointsArr },
        uIntensities: { value: intensitiesArr },
        uTime: { value: 0 },
      },
      depthTest: false,
      depthWrite: false,
    });

    const scene = new THREE.Scene();
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));

    return {
      maskScene: scene,
      maskMaterial: mat,
      clipCamera: clipCam,
      scratchColor: new THREE.Color(),
    };
  }, []);

  useFrame((state, delta) => {
    timeRef.current += delta;
    const { width, height } = state.size;

    // ── Update trail (chain-follow with head/tail lerp) ──
    const trail = heroRefs.trailRef.current;
    const mouse = heroRefs.mouseRef.current;
    const entered = heroRefs.hasEnteredRef.current;

    if (entered && mouse.x > -999) {
      // Head follows mouse
      const dx0 = mouse.x - trail[0].x;
      const dy0 = mouse.y - trail[0].y;
      trail[0].prevX = trail[0].x;
      trail[0].prevY = trail[0].y;
      trail[0].x += dx0 * HEAD_LERP;
      trail[0].y += dy0 * HEAD_LERP;

      // Each subsequent point follows the one ahead
      for (let i = 1; i < TRAIL_LENGTH; i++) {
        trail[i].prevX = trail[i].x;
        trail[i].prevY = trail[i].y;
        trail[i].x += (trail[i - 1].x - trail[i].x) * TAIL_LERP;
        trail[i].y += (trail[i - 1].y - trail[i].y) * TAIL_LERP;
      }

      // Velocity and width for each point
      for (let i = 0; i < TRAIL_LENGTH; i++) {
        const dvx = trail[i].x - trail[i].prevX;
        const dvy = trail[i].y - trail[i].prevY;
        trail[i].velocity = Math.sqrt(dvx * dvx + dvy * dvy);
        const normalizedVel = Math.min(trail[i].velocity * VEL_SCALE * 0.1, 1);
        trail[i].width =
          MIN_RIBBON_HALF_WIDTH +
          normalizedVel * (MAX_RIBBON_HALF_WIDTH - MIN_RIBBON_HALF_WIDTH);
      }
    }

    // ── Update metaball uniforms ──
    const pointsArr = maskMaterial.uniforms.uPoints
      .value as THREE.Vector3[];
    const intensitiesArr = maskMaterial.uniforms.uIntensities
      .value as number[];

    for (let i = 0; i < TRAIL_LENGTH; i++) {
      const pt = trail[i];
      if (entered && pt.x > -999) {
        // Map trail width to metaball radius
        const velRatio =
          (pt.width - MIN_RIBBON_HALF_WIDTH) /
          (MAX_RIBBON_HALF_WIDTH - MIN_RIBBON_HALF_WIDTH);
        const radius = METABALL_BASE_RADIUS + velRatio * METABALL_VEL_RADIUS;

        // Y-flip: screen coords (Y-down) → FBO coords (Y-up)
        pointsArr[i].set(pt.x, height - pt.y, radius);

        // Intensity: tapers head→tail, boosted by velocity
        const taper = 1 - i / (TRAIL_LENGTH - 1);
        const velBoost = Math.min(pt.velocity * 0.05, 0.5);
        intensitiesArr[i] = taper * (0.5 + velBoost);
      } else {
        pointsArr[i].set(0, 0, 0);
        intensitiesArr[i] = 0;
      }
    }

    maskMaterial.uniforms.uResolution.value.set(width, height);
    maskMaterial.uniforms.uTime.value = timeRef.current;

    // ── Ping-pong FBO rendering ──
    const fboRead = pingRef.current === 0 ? fboA : fboB;
    const fboWrite = pingRef.current === 0 ? fboB : fboA;

    // Save renderer clear state
    gl.getClearColor(scratchColor);
    const prevClearAlpha = gl.getClearAlpha();

    // Clear FBO to premultiplied transparent black (0,0,0,0)
    gl.setClearColor(0x000000, 0);

    maskMaterial.uniforms.uPrevFrame.value = fboRead.texture;
    gl.setRenderTarget(fboWrite);
    gl.clear();
    gl.render(maskScene, clipCamera);

    gl.setRenderTarget(null);

    // Restore renderer clear state
    gl.setClearColor(scratchColor, prevClearAlpha);
    pingRef.current = pingRef.current === 0 ? 1 : 0;

    // Expose current mask to other components
    heroRefs.maskRef.current = fboWrite;
  });

  // Renders nothing to the main scene
  return null;
}
