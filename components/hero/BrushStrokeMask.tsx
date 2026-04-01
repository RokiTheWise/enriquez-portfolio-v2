"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useFBO } from "@react-three/drei";
import {
  ribbonVertex,
  ribbonFragment,
  fadeVertex,
  fadeFragment,
} from "./shaders";
import type { HeroRefs } from "./types";
import {
  TRAIL_LENGTH,
  HEAD_LERP,
  TAIL_LERP,
  MIN_RIBBON_HALF_WIDTH,
  MAX_RIBBON_HALF_WIDTH,
  VEL_SCALE,
  MIN_VEL,
  NOISE_FREQ,
  NOISE_AMP,
  NOISE_SCROLL_SPEED,
  FADE_FACTOR,
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

  // Offscreen scenes + orthographic camera (pixel-space)
  const {
    fadeScene,
    fadeMaterial,
    ribbonScene,
    ribbonMesh,
    clipCamera,
    pixelCamera,
  } = useMemo(() => {
    // Clip-space camera for fade pass (PlaneGeometry(2,2) maps -1..1)
    const clipCam = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);

    // Pixel-space camera for ribbon (updated each frame to match canvas)
    const pixelCam = new THREE.OrthographicCamera(0, 1, 0, 1, -1, 1);

    // Fade pass: fullscreen quad that reads previous FBO and decays
    const fScene = new THREE.Scene();
    const fGeo = new THREE.PlaneGeometry(2, 2);
    const fMat = new THREE.ShaderMaterial({
      vertexShader: fadeVertex,
      fragmentShader: fadeFragment,
      uniforms: {
        uPrevFrame: { value: null },
        uDecay: { value: FADE_FACTOR },
      },
      depthTest: false,
      depthWrite: false,
    });
    const fMesh = new THREE.Mesh(fGeo, fMat);
    fScene.add(fMesh);

    // Ribbon: triangle-strip geometry with pre-allocated buffers
    const rScene = new THREE.Scene();
    const maxVerts = TRAIL_LENGTH * 2;
    const rGeo = new THREE.BufferGeometry();
    rGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(maxVerts * 3), 3),
    );
    rGeo.setAttribute(
      "aNormal",
      new THREE.BufferAttribute(new Float32Array(maxVerts * 2), 2),
    );
    rGeo.setAttribute(
      "aSide",
      new THREE.BufferAttribute(new Float32Array(maxVerts), 1),
    );
    rGeo.setAttribute(
      "aAlpha",
      new THREE.BufferAttribute(new Float32Array(maxVerts), 1),
    );
    rGeo.setAttribute(
      "aVelocity",
      new THREE.BufferAttribute(new Float32Array(maxVerts), 1),
    );

    // Set side attribute: alternating +1 / -1
    const sideArr = rGeo.attributes.aSide.array as Float32Array;
    for (let i = 0; i < TRAIL_LENGTH; i++) {
      sideArr[i * 2] = 1;
      sideArr[i * 2 + 1] = -1;
    }

    // Index buffer for triangle pairs
    const indices: number[] = [];
    for (let i = 0; i < TRAIL_LENGTH - 1; i++) {
      const a = i * 2;
      indices.push(a, a + 1, a + 2, a + 2, a + 1, a + 3);
    }
    rGeo.setIndex(indices);

    const rMat = new THREE.ShaderMaterial({
      vertexShader: ribbonVertex,
      fragmentShader: ribbonFragment,
      uniforms: {
        uTime: { value: 0 },
        uNoiseFreq: { value: NOISE_FREQ },
        uNoiseAmp: { value: NOISE_AMP },
        uNoiseSpeed: { value: NOISE_SCROLL_SPEED },
      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
      // Max blending: result = max(src, dst) — new ribbon doesn't lower existing mask
      blending: THREE.CustomBlending,
      blendEquation: THREE.MaxEquation,
      blendSrc: THREE.OneFactor,
      blendDst: THREE.OneFactor,
    });

    const rMeshObj = new THREE.Mesh(rGeo, rMat);
    rScene.add(rMeshObj);

    return {
      fadeScene: fScene,
      fadeMaterial: fMat,
      ribbonScene: rScene,
      ribbonMesh: rMeshObj,
      clipCamera: clipCam,
      pixelCamera: pixelCam,
    };
  }, []);

  useFrame((state, delta) => {
    timeRef.current += delta;
    const { width, height } = state.size;

    // Update pixel camera to match canvas dimensions
    pixelCamera.right = width;
    pixelCamera.bottom = height;
    pixelCamera.updateProjectionMatrix();

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

      // Each subsequent point follows the one ahead with TAIL_LERP
      for (let i = 1; i < TRAIL_LENGTH; i++) {
        trail[i].prevX = trail[i].x;
        trail[i].prevY = trail[i].y;
        trail[i].x += (trail[i - 1].x - trail[i].x) * TAIL_LERP;
        trail[i].y += (trail[i - 1].y - trail[i].y) * TAIL_LERP;
      }

      // Compute velocity and width for each point
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

    // ── Build ribbon geometry from trail ──
    const posArr = ribbonMesh.geometry.attributes.position
      .array as Float32Array;
    const normArr = ribbonMesh.geometry.attributes.aNormal
      .array as Float32Array;
    const alphaArr = ribbonMesh.geometry.attributes.aAlpha
      .array as Float32Array;
    const velArr = ribbonMesh.geometry.attributes.aVelocity
      .array as Float32Array;

    let hasValidGeometry = false;

    if (entered) {
      for (let i = 0; i < TRAIL_LENGTH; i++) {
        const pt = trail[i];
        // Tangent direction (forward along trail)
        let tx: number, ty: number;
        if (i < TRAIL_LENGTH - 1) {
          tx = trail[i].x - trail[i + 1].x;
          ty = trail[i].y - trail[i + 1].y;
        } else {
          tx = trail[i - 1].x - trail[i].x;
          ty = trail[i - 1].y - trail[i].y;
        }
        const tLen = Math.sqrt(tx * tx + ty * ty);
        if (tLen > 0.001) {
          tx /= tLen;
          ty /= tLen;
        } else {
          tx = 1;
          ty = 0;
        }

        // Normal (perpendicular)
        const nx = -ty;
        const ny = tx;
        const w = pt.width;

        // Alpha: 1 at head (i=0), 0 at tail (i=TRAIL_LENGTH-1)
        const alpha = 1 - i / (TRAIL_LENGTH - 1);

        // Left vertex
        const li = i * 2;
        posArr[li * 3] = pt.x + nx * w;
        posArr[li * 3 + 1] = pt.y + ny * w;
        posArr[li * 3 + 2] = 0;
        normArr[li * 2] = nx;
        normArr[li * 2 + 1] = ny;
        alphaArr[li] = alpha;
        velArr[li] = Math.min(pt.velocity * 0.1, 1);

        // Right vertex
        const ri = li + 1;
        posArr[ri * 3] = pt.x - nx * w;
        posArr[ri * 3 + 1] = pt.y - ny * w;
        posArr[ri * 3 + 2] = 0;
        normArr[ri * 2] = nx;
        normArr[ri * 2 + 1] = ny;
        alphaArr[ri] = alpha;
        velArr[ri] = Math.min(pt.velocity * 0.1, 1);

        if (pt.velocity > MIN_VEL) hasValidGeometry = true;
      }

      ribbonMesh.geometry.attributes.position.needsUpdate = true;
      ribbonMesh.geometry.attributes.aNormal.needsUpdate = true;
      ribbonMesh.geometry.attributes.aAlpha.needsUpdate = true;
      ribbonMesh.geometry.attributes.aVelocity.needsUpdate = true;
    }

    // ── Update ribbon shader time ──
    (ribbonMesh.material as THREE.ShaderMaterial).uniforms.uTime.value =
      timeRef.current;

    // ── Ping-pong FBO rendering ──
    const fboRead = pingRef.current === 0 ? fboA : fboB;
    const fboWrite = pingRef.current === 0 ? fboB : fboA;

    // 1. Fade pass: decay previous frame (clip-space camera for fullscreen quad)
    fadeMaterial.uniforms.uPrevFrame.value = fboRead.texture;
    gl.setRenderTarget(fboWrite);
    gl.clear();
    gl.render(fadeScene, clipCamera);

    // 2. Stamp ribbon on top (pixel-space camera for ribbon geometry)
    if (entered && hasValidGeometry) {
      // Don't clear — render on top of faded content
      gl.render(ribbonScene, pixelCamera);
    }

    // 3. Reset render target
    gl.setRenderTarget(null);

    // 4. Swap
    pingRef.current = pingRef.current === 0 ? 1 : 0;

    // 5. Expose current mask to other components
    heroRefs.maskRef.current = fboWrite;
  });

  // This component renders nothing to the main scene
  return null;
}
