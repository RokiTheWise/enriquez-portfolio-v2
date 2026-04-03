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

// Ribbon trail (still used for trail-following geometry sizing)
export const TRAIL_LENGTH = 15;
export const HEAD_LERP = 0.12;
export const TAIL_LERP = 0.04;
export const MIN_RIBBON_HALF_WIDTH = 10; // px
export const MAX_RIBBON_HALF_WIDTH = 75; // px
export const VEL_SCALE = 2.5;

// Metaball mask
export const FADE_FACTOR = 0.90; // aggressive evaporation
export const METABALL_BASE_RADIUS = 60; // px, base radius at rest
export const METABALL_VEL_RADIUS = 100; // additional px at full velocity

// Particles
export const PARTICLE_COUNT = 460;
export const PARTICLE_SPREAD = 5;
export const PARTICLE_SPEED = 0.19;
export const PARTICLE_BASE_SIZE = 100;
export const PARTICLE_SIZE_RANDOMNESS = 1;
export const CAMERA_DISTANCE = 20;
export const CAMERA_FOV = 15;
export const PARTICLE_COLORS = ["#db8b00", "#000000", "#ffffff"];

// Viscous physics (CPU-side)
export const DAMPING = 0.92; // velocity damping per frame
export const RETURN_FORCE = 0.03; // spring force pulling back to origin
export const REPULSION_STRENGTH = 0.85;
export const REPULSION_RADIUS_SCALE = 6.0;
export const REPULSION_MIN_WORLD_RADIUS = 0.4;
export const BOW_WAVE_STRENGTH = 1.2; // exponential bow-wave intensity

// Image sizing (px) — responsive breakpoints
export const IMAGE_SIZES = { sm: 420, md: 500, lg: 600 } as const;
