import type { RefObject } from "react";

/* ── Shared refs passed between hero sub-components ── */
export interface HeroRefs {
  mouseRef: RefObject<{ x: number; y: number; active: boolean }>;
  scrollProgressRef: RefObject<number>;
}

/* ── Tuning constants ── */

// Particles
export const PARTICLE_COUNT = 460;
export const PARTICLE_SPREAD = 5;
export const PARTICLE_SPEED = 0.19;
export const PARTICLE_BASE_SIZE = 150;
export const PARTICLE_SIZE_RANDOMNESS = 1;
export const CAMERA_DISTANCE = 20;
export const CAMERA_FOV = 15;
export const PARTICLE_COLORS = ["#db8b00", "#000000", "#ffffff"];

// Gravitational physics (CPU-side)
export const DAMPING = 0.92;
export const RETURN_FORCE = 0.03;
export const REPULSION_STRENGTH = 0.85;
export const REPULSION_RADIUS_WORLD = 2.4;   // how far the cursor's pull reaches
export const BOW_WAVE_STRENGTH = 1.2;

// Image sizing (px) — responsive breakpoints
export const IMAGE_SIZES = { sm: 420, md: 500, lg: 600 } as const;

// Portrait cycle timing (seconds)
export const PORTRAIT_HOLD = 2.0;        // time fully visible on each photo
export const PORTRAIT_CROSSFADE = 0.8;   // crossfade duration
