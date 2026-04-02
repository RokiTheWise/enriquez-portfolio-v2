import type { WebGLRenderTarget } from "three";
import type { MutableRefObject } from "react";

/* ── Trail point stored per frame ── */
export interface TrailPoint {
  x: number; // pixel coords relative to canvas
  y: number;
  prevX: number;
  prevY: number;
  velocity: number; // magnitude of movement this frame
  width: number; // ribbon half-width in pixels at this point
}

/* ── Shared refs passed between hero sub-components ── */
export interface HeroRefs {
  mouseRef: MutableRefObject<{ x: number; y: number }>;
  trailRef: MutableRefObject<TrailPoint[]>;
  maskRef: MutableRefObject<WebGLRenderTarget | null>;
  hasEnteredRef: MutableRefObject<boolean>;
}

/* ── Tuning constants ── */

// Ribbon trail
export const TRAIL_LENGTH = 15;
export const HEAD_LERP = 0.12;
export const TAIL_LERP = 0.04;
export const MIN_RIBBON_HALF_WIDTH = 10; // px
export const MAX_RIBBON_HALF_WIDTH = 75; // px
export const VEL_SCALE = 2.5;
export const MIN_VEL = 0.5; // ignore micro-movements

// Perlin noise distortion
export const NOISE_FREQ = 3.0;
export const NOISE_AMP = 0.45;
export const NOISE_SCROLL_SPEED = 1.5;

// FBO decay
export const FADE_FACTOR = 0.93; // per-frame alpha multiply (~0.5s full decay at 60fps)

// Particles
export const PARTICLE_COUNT = 460;
export const PARTICLE_SPREAD = 5;
export const PARTICLE_SPEED = 0.19;
export const PARTICLE_BASE_SIZE = 100;
export const PARTICLE_SIZE_RANDOMNESS = 1;
export const CAMERA_DISTANCE = 20;
export const CAMERA_FOV = 15;
export const REPULSION_RADIUS_SCALE = 6.0;
export const REPULSION_STRENGTH = 0.5;
export const REPULSION_MIN_WORLD_RADIUS = 0.4; // minimum radius in world units for visible feedback
export const WAKE_STRENGTH = 0.6; // directional bow-wave / wake intensity
export const PARTICLE_COLORS = ["#db8b00", "#000000", "#ffffff"];

// Image sizing (px) — responsive breakpoints
export const IMAGE_SIZES = { sm: 420, md: 500, lg: 600 } as const;
